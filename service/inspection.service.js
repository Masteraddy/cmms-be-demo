const Inspection = require('../model/Inspection');
const User = require('../model/User');
const {
  sendEmail,
  newInspectionTemplate,
  beforeInspScheduleTemplate,
  afterInspScheduleTemplate,
} = require('./mail.service');
const agenda = require('../config/agenda');

const InspectionService = {
  get: (req, res) => {
    Inspection.find({})
      .populate('projectsite category')
      .sort({ createdAt: -1 })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get inspections`, error }),
      );
  },

  getOne: (req, res) => {
    Inspection.findById(req.params.id)
      .populate('projectsite category')
      .then((result) => {
        if (!result)
          return res
            .status(404)
            .json({ success: false, message: 'Inspection not found' });

        res.status(200).json({ success: true, result });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get inspection`, error }),
      );
  },

  create: (req, res) => {
    var {
      name,
      email,
      location,
      projectsite,
      building,
      floor,
      wing,
      room,
      category,
      observation,
      workcategory,
      solution,
      actionby,
      estimatecost,
      dimension,
      picture,
    } = req.body;
    Inspection.find({})
      .sort({ createdAt: -1 })
      .then((invs) => {
        const userTypes = [
          'manager',
          'team-member',
          'technician',
          'procurement',
        ];
        User.find({ usertype: { $in: userTypes } })
          .then((teams) => {
            //   console.log(teams);
            let teamsEmail = [];
            teams.forEach((element) => {
              if (!element.busy) {
                teamsEmail.push(element.email);
              }
            });

            let length = invs.length;
            let serial = length + 1;
            if (invs.length > 0) {
              serial = invs[0].serial + 1 || length + 1;
            }
            if (
              name &&
              email &&
              location &&
              projectsite &&
              building &&
              floor &&
              wing &&
              room &&
              category &&
              observation &&
              workcategory &&
              solution &&
              actionby &&
              estimatecost &&
              dimension
            ) {
              var newInspection = new Inspection({
                serial,
                name,
                email,
                location,
                projectsite,
                building,
                floor,
                wing,
                room,
                category,
                observation,
                workcategory,
                solution,
                actionby,
                estimatecost,
                dimension,
                picture,
              });

              newInspection
                .save()
                .then((result) => {
                  teamsEmail.forEach((mail, i) => {
                    sendEmail(newInspectionTemplate(mail, result));
                  });
                  res.json({ success: true, result });
                })
                .catch((error) => {
                  // console.log(error);
                  res.status(500).json({
                    success: false,
                    message: "Can't create new inspection",
                    error,
                  });
                });
            } else {
              res.status(500).json({
                success: false,
                message: 'Please enter all required field!',
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              success: false,
              message: "Can't create new inspection!",
              error,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Can't create new inspection!",
          error,
        });
      });
  },

  patch: (req, res) => {
    let newData = req.body;
    let final = {
      status: newData.status,
    };
    Inspection.findById(req.params.id)
      .populate('from', 'email')
      .then((inspection) => {
        // for (let key in newData) {
        //   if (newData[key] !== '') {
        //     final[key] = newData[key];
        //     if (key === 'status') {
        //       // console.log(requests.from.email);
        //       if (newData[key] === 'done') {
        //         sendEmail(
        //           statusChangeDoneTemplate(requests.from.email, requests),
        //           (status) => {
        //             console.log(status);
        //           },
        //         );
        //       } else {
        //         sendEmail(
        //           statusChangeTemplate(requests.from.email, requests),
        //           (status) => {
        //             console.log(status);
        //           },
        //         );
        //       }
        //     }
        //   }
        // }
        Inspection.updateOne({ _id: req.params.id }, { $set: final })
          .then((result) => {
            res.status(200).json({ success: true, result });
          })
          .catch((error) =>
            res.status(500).json({
              success: false,
              message: 'Unable to change inspection status',
              error,
            }),
          );
      })
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: 'Unable to change status',
          error,
        }),
      );
  },

  putSchedule: (req, res) => {
    const timescheduled = req.body.timescheduled;
    let date = new Date(timescheduled);

    if (date.getTime() < Date.now())
      return res
        .status(400)
        .json({ success: false, message: `Schedule can't be set to past` });

    //Call the function to schedule email sending
    if (timescheduled === '' || typeof timescheduled === 'undefined')
      return res
        .status(400)
        .json({ success: false, message: 'No time is scheduled' });

    Inspection.update({ _id: req.params.id }, { $set: { timescheduled } })
      .then((reslt) => {
        Inspection.findById(req.params.id).then((request) => {
          sendEmail(
            beforeInspScheduleTemplate(req.body.email, request),
            (status) => console.log(status),
          );

          // Add scheduler here with newdate
          agenda.schedule(date.toLocaleString(), 'schedule inspection mail', {
            to: req.body.email,
            request,
            date,
          });
          // sendEmail(afterInspScheduleTemplate(req.body.email, request, date));

          res.status(200).json({
            success: true,
            result: { message: 'Inspection Scheduled!' },
          });
        });
      })
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Inspection can't be scheduled",
          error,
        }),
      );
  },

  delete: (req, res) => {
    Inspection.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Inspection can't be delete",
          error,
        }),
      );
  },
};

module.exports = InspectionService;

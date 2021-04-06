const RequestOut = require('../model/RequestOut');
const User = require('../model/User');
const {
  sendEmail,
  newRequestTemplate,
  workOutAssignedTemplate,
  beforeOutScheduleTemplate,
  afterOutScheduleTemplate,
} = require('./mail.service');

const agenda = require('../config/agenda');

const requestOutService = {
  find: (req, res) => {
    const userTypes = ['team-member', 'technician', 'procurement'];
    User.findById(req.user.id)
      .select('-password')
      .populate('location')
      .then((user) => {
        //     console.log(user);
        // console.log(user.usertype === 'manager');
        RequestOut.find({})
          .populate('comments.id', 'firstname lastname email address usertype')
          .populate('propertyId')
          .sort({ timestart: -1 })
          .then((data) => {
            // console.log(user);
            let userLocation = 'No location yet';
            if (user.location) {
              userLocation = `${user.location.state}-${user.location.area}`;
            }
            if (req.user.usertype === 'manager') {
              res.status(200).json({
                result: data,
                success: true,
              });
            } else if (userTypes.includes(req.user.usertype)) {
              let result = data.filter((dt) => {
                // console.log(dt.propertyId.location, userLocation);
                return (
                  dt.propertyId.location === userLocation ||
                  dt.assignedId == req.user.id
                );
              });
              res.status(200).json({
                result,
                success: true,
              });
            } else {
              res.status(200).json({
                success: true,
                result: [],
                message: 'Sorry you are not allowed to see this request!',
              });
            }
          })
          .catch((err) =>
            res.status(500).json({
              success: false,
              message: 'Error while fetching data',
              error: err,
            }),
          );
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: 'Error while fetching data',
          error,
        });
      });
  },

  findOne: (req, res) => {
    const userTypes = ['team-member', 'technician', 'procurement'];
    User.findById(req.user.id)
      .populate('location')
      .then((user) => {
        // console.log(user);
        let userLocation = `${user.location.state}-${user.location.area}`;
        if (userTypes.includes(req.user.usertype)) {
          RequestOut.findById(req.params.id)
            .populate(
              'comments.id',
              'firstname lastname email address usertype',
            )
            .populate('propertyId')
            .select('-__v')
            .then((result) => {
              if (!result)
                return res
                  .status(404)
                  .json({ success: false, message: 'Request not found!' });

              var soln = result;
              if (
                result.propertyId.location === userLocation ||
                result.assignedId == req.user.id
              )
                return res.status(200).json({
                  success: true,
                  result: soln,
                });
              return res.status(401).json({
                success: false,
                message: 'Sorry you are not allowed to see this request!',
              });
            })
            .catch((error) =>
              res
                .status(500)
                .json({ success: false, message: 'Request not found!', error }),
            );
        } else if (user.usertype === 'manager') {
          RequestOut.findById(req.params.id)
            .populate(
              'comments.id',
              'firstname lastname email address usertype',
            )
            .select('-__v')
            .then((result) => {
              if (!result)
                return res
                  .status(404)
                  .json({ success: false, message: 'Request not found!' });

              var soln = result;
              return res.status(200).json({
                success: true,
                result: soln,
              });
            })
            .catch((error) =>
              res
                .status(500)
                .json({ success: false, message: 'Request not found!', error }),
            );
        } else {
          res.status(401).json({
            success: false,
            message: 'Sorry you are not allowed to see this request!',
          });
        }
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: 'Request not found!', error }),
      );
  },

  post: (req, res) => {
    var {
      apartment,
      description,
      email,
      property,
      propertyId,
      fullname,
      phone,
      picture,
      type,
    } = req.body;
    if (email && property && propertyId && fullname && phone && type) {
      const userTypes = ['manager', 'team-member', 'technician', 'procurement'];
      User.find({ usertype: { $in: userTypes } })
        .then((teams) => {
          //   console.log(teams);
          let teamsEmail = [];
          teams.forEach((element) => {
            if (!element.busy) {
              teamsEmail.push(element.email);
            }
          });

          RequestOut.find({})
            .sort({ timestart: -1 })
            .then((reqs) => {
              let length = reqs.length;
              let serial = length + 1;
              if (length > 0) {
                serial = reqs[0].serial + 1 || length + 1;
              }
              var newRequest = new RequestOut({
                serial,
                fullname,
                email,
                phone,
                apartment,
                type,
                description,
                property,
                propertyId,
                picture,
              });
              newRequest
                .save()
                .then((result) => {
                  teamsEmail.forEach((mail, i) => {
                    sendEmail(newRequestTemplate(mail, result), (status) => {
                      console.log(status);
                    });
                  });
                  res.status(201).json({ success: true, result });
                })
                .catch((error) =>
                  res.status(500).json({
                    success: false,
                    message: "Sorry, can't add new request now",
                  }),
                );
            })
            .catch((error) =>
              res.status(500).json({
                success: false,
                message: "Sorry, can't add new request now",
              }),
            );
        })
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: "Sorry, can't add new request now",
          }),
        );
    } else {
      res
        .status(500)
        .json({ success: false, message: 'Please enter all required field!' });
    }
  },

  patch: (req, res) => {
    let newData = req.body;
    let final = {};
    RequestOut.findById(req.params.id)
      .then((requests) => {
        for (let key in newData) {
          if (newData[key] !== '') {
            final[key] = newData[key];
            if (key === 'assigned') {
              User.updateOne(
                { email: req.body.email },
                { busy: false },
                (err, raw) => {
                  if (err) console.log(err);
                  sendEmail(
                    workOutAssignedTemplate(req.body.email, requests),
                    (status) => {
                      console.log(status);
                    },
                  );
                },
              );
            }
          }
        }
        RequestOut.updateOne({ _id: req.params.id }, { $set: final })
          .then((result) => {
            if (
              final.status === 'done' ||
              final.status === 'park' ||
              final.status === 'hold'
            ) {
              // console.log(final);
              User.updateOne(
                { _id: requests.assignedId },
                { busy: false },
                (err, raw) => {
                  if (err) console.log(err);
                  res.status(200).json({ success: true, result });
                },
              );
            } else {
              User.updateOne(
                { _id: requests.assignedId },
                { busy: true },
                (err, raw) => {
                  if (err) console.log(err);
                  res.status(200).json({ success: true, result });
                },
              );
            }
          })
          .catch((error) =>
            res.status(500).json({
              success: false,
              message: 'Unable to assign user to work',
              error,
            }),
          );
      })
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: 'Unable to assign user to work',
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

    RequestOut.update({ _id: req.params.id }, { $set: { timescheduled } })
      .then((reslt) => {
        RequestOut.findById(req.params.id).then((request) => {
          sendEmail(
            beforeOutScheduleTemplate(req.body.email, request),
            (status) => {
              console.log(status);
            },
          );

          agenda.schedule(date.toLocaleString(), 'schedule outrequest mail', {
            to: req.body.email,
            request,
            date,
          });
          // Add scheduler here with newdate
          // sendEmail(afterScheduleTemplate(req.body.email, request, date));

          res.status(200).json({
            success: true,
            result: { message: 'Workorder Scheduled!' },
          });
        });
      })
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Workorder can't be scheduled",
          error,
        }),
      );
  },

  postComment: (req, res) => {
    const { comment } = req.body;
    let comments = {
      id: req.user.id,
      text: comment,
    };
    const userTypes = ['manager', 'technician', 'procurement', 'team-member'];
    if (userTypes.includes(req.user.usertype)) {
      RequestOut.updateOne({ _id: req.params.id }, { $push: { comments } })
        .then((result) => res.status(200).json({ success: true, result }))
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: 'Unable to change data',
            error,
          }),
        );
    }
  },

  delete: (req, res) => {
    RequestOut.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Workorder can't be delete",
          error,
        }),
      );
  },
};

module.exports = requestOutService;

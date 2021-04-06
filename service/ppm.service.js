const Ppm = require('../model/Ppm');
const User = require('../model/User');
const { sendEmail, newPpmTemplate } = require('./mail.service');
const agenda = require('../config/agenda');

const PpmService = {
  get: (req, res) => {
    Ppm.find({})
      .populate('projectsite category')
      .sort({ createdAt: -1 })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get ppms`, error }),
      );
  },

  getOne: (req, res) => {
    Ppm.findById(req.params.id)
      .populate('projectsite category')
      .then((result) => {
        if (!result)
          return res
            .status(404)
            .json({ success: false, message: 'Ppm not found' });

        res.status(200).json({ success: true, result });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get ppm`, error }),
      );
  },

  create: (req, res) => {
    var {
      ppmname,
      email,
      projectsite,
      category,
      startdate,
      nextdate,
      comment,
    } = req.body;
    Ppm.find({})
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
              ppmname &&
              email &&
              projectsite &&
              category &&
              startdate &&
              nextdate &&
              comment
            ) {
              var newPpm = new Ppm({
                serial,
                ppmname,
                email,
                projectsite,
                category,
                startdate,
                nextdate,
                comment,
              });

              newPpm
                .save()
                .then((result) => {
                  teamsEmail.forEach((mail, i) => {
                    sendEmail(newPpmTemplate(mail, result));
                  });
                  res.json({ success: true, result });
                })
                .catch((error) => {
                  // console.log(error);
                  res.status(500).json({
                    success: false,
                    message: "Can't create new ppm",
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
              message: "Can't create new ppm!",
              error,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Can't create new ppm!",
          error,
        });
      });
  },

  delete: (req, res) => {
    Ppm.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Ppm can't be delete",
          error,
        }),
      );
  },
};

module.exports = PpmService;

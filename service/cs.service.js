const Cs = require('../model/Cs');
const User = require('../model/User');
const { sendEmail, newCsTemplate } = require('./mail.service');

const CsService = {
  get: (req, res) => {
    Cs.find({})
      .populate('projectsite category')
      .sort({ createdAt: -1 })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get css`, error }),
      );
  },

  getOne: (req, res) => {
    Cs.findById(req.params.id)
      .then((result) => {
        if (!result)
          return res.status(404).json({ success: false, message: 'Not found' });

        res.status(200).json({ success: true, result });
      })
      .catch((error) =>
        res.status(500).json({ success: false, message: `Can't get`, error }),
      );
  },

  create: (req, res) => {
    var {
      fullname,
      email,
      phone,
      projectsite,
      ticket,
      quality,
      appearance,
      timing,
      professionalism,
      ticketclose,
      comment,
    } = req.body;
    // console.log(req.body);
    Cs.find({})
      .sort({ createdAt: -1 })
      .then((invs) => {
        const userTypes = ['manager'];
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
              fullname &&
              email &&
              phone &&
              projectsite &&
              ticket &&
              quality &&
              appearance &&
              timing &&
              professionalism &&
              ticketclose &&
              comment
            ) {
              var newCs = new Cs({
                serial,
                fullname,
                email,
                phone,
                projectsite,
                ticket,
                quality,
                appearance,
                timing,
                professionalism,
                ticketclose,
                comment,
              });

              newCs
                .save()
                .then((result) => {
                  teamsEmail.forEach((mail, i) => {
                    sendEmail(newCsTemplate(mail, result));
                  });
                  res.json({ success: true, result });
                })
                .catch((error) => {
                  // console.log(error);
                  res.status(500).json({
                    success: false,
                    message: "Can't create new",
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
              message: "Can't create new",
              error,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Can't create new",
          error,
        });
      });
  },

  delete: (req, res) => {
    Cs.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "can't be deleted",
          error,
        }),
      );
  },
};

module.exports = CsService;

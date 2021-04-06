const Asset = require('../model/Asset');
const User = require('../model/User');
// const { sendEmail, inventoryUpdateTemplate } = require('./mail.service');

const AssetService = {
  get: (req, res) => {
    Asset.find({})
      .populate('request.id', 'usertype firstname lastname email')
      .select('-__v')
      .sort({ createdAt: -1 })
      .then((data) => {
        var result = data.map((rslt) => {
          rslt.all = rslt.available + rslt.used;
          return rslt;
        });
        res.status(200).json({ success: true, result });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get assets`, error }),
      );
  },

  getOne: (req, res) => {
    Asset.findById(req.params.id)
      .populate('request.id', 'usertype firstname lastname email')
      .select('-__v')
      .then((result) => {
        if (!result)
          return res
            .status(404)
            .json({ success: false, message: 'Asset not found' });

        result.all = result.available + result.used;
        res.status(200).json({ success: true, result });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get asset`, error }),
      );
  },

  create: (req, res) => {
    var { name, available, description } = req.body;
    Asset.find({})
      .sort({ createdAt: -1 })
      .then((invs) => {
        let length = invs.length;
        let serial = length + 1;
        if (invs.length > 0) {
          serial = invs[0].serial + 1 || length + 1;
        }
        if (name && available && description) {
          var newAsset = new Asset({
            serial,
            name,
            description,
            available,
            all: available,
          });

          newAsset
            .save()
            .then((data) => res.json({ success: true, result: data }))
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                success: false,
                message: "Can't create new asset",
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
          message: "Can't create new asset!",
          error,
        });
      });
  },

  delete: (req, res) => {
    Asset.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Asset can't be delete",
          error,
        }),
      );
  },

  patch: (req, res) => {
    let newData = req.body;
    let final = {};
    for (let key in newData) {
      if (newData[key] !== '') {
        if (key === 'name' || key === 'available' || key === 'description') {
          final[key] = newData[key];
        }
      }
    }
    Asset.updateOne({ _id: req.params.id }, { $set: final })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: 'Unable to change data', error }),
      );
  },

  select: (req, res) => {
    const { number } = req.body;
    const userTypes = ['manager', 'technician', 'procurement'];
    if (
      req.user.usertype === 'manager' ||
      req.user.usertype === 'technician' ||
      req.user.usertype === 'procurement' ||
      req.user.usertype === 'team-member'
    ) {
      User.find({ usertype: { $in: userTypes } })
        .then((teams) => {
          //   console.log(teams);
          let teamsEmail = [];
          teams.forEach((element) => {
            teamsEmail.push(element.email);
          });
          Asset.findById(req.params.id)
            .then((rslt) => {
              let available = rslt.available - number;
              let used = rslt.used + number;
              let request = { id: req.user.id, number };
              let final = { available, used };
              //   if (available <= 5) {
              //      You can send email here
              //     teamsEmail.forEach((mail, i) => {
              //       sendEmail(inventoryUpdateTemplate(mail, rslt), (status) => {
              //         console.log(status);
              //       });
              //     });
              //   }
              if (available < 0) {
                res.status(400).json({
                  success: false,
                  message: 'Total asset requred is more than available asset',
                });
              } else {
                Asset.updateOne(
                  { _id: req.params.id },
                  { $push: { request }, $set: final },
                )
                  .then((result) =>
                    res.status(200).json({ success: true, result }),
                  )
                  .catch((error) =>
                    res.status(500).json({
                      success: false,
                      message: 'Unable to change data',
                      error,
                    }),
                  );
              }
            })
            .catch((error) =>
              res.status(500).json({
                success: false,
                message: 'Unable to change data',
                error,
              }),
            );
        })
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: 'Unable to change data',
            error,
          }),
        );
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Sorry, you are not authorized' });
    }
  },

  submit: (req, res) => {
    if (
      req.user.usertype === 'manager' ||
      req.user.usertype === 'technician' ||
      req.user.usertype === 'procurement' ||
      req.user.usertype === 'team-member'
    ) {
      Asset.findById(req.params.id)
        .then((rslt) => {
          // let users = { id: userId, number };
          let request = rslt.request.filter(
            (dt) => dt._id != req.params.lendId,
          );
          let user = rslt.request.find((dt) => dt._id == req.params.lendId);
          if (!user)
            return res.status(404).json({
              success: false,
              message: 'Asset return record not found',
            });
          let available = rslt.available + user.number;
          let used = rslt.used - user.number;
          let final = { available, request, used };
          // console.log(user, req.params.lendId, rslt.available, users);
          Asset.updateOne({ _id: req.params.id }, { $set: final })
            .then((result) => res.status(200).json({ success: true, result }))
            .catch((error) =>
              res.status(500).json({
                success: false,
                message: 'Unable to change data',
                error,
              }),
            );
        })
        .catch((error) =>
          res
            .status(500)
            .json({ success: false, message: 'Unable to change data', error }),
        );
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Sorry, you are not authorized' });
    }
  },
};

module.exports = AssetService;

const IHSData = require("../model/IHSData");

const ihsdataService = {
  /**
   * Get all ihsdatas from database
   * @param req Request to the server
   * @param res Response from the server
   */
  findOne: async (req, res) => {
    try {
      let result = await IHSData.findById(req.params.id).select("-__v");

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "IHS Data not found!" });
      }
      res.status(200).json({ success: true, result });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: `Can't get ihs data`, error });
    }
  },

  /**
   * Get all ihsdatas from database
   * @param req Request to the server
   * @param res Response from the server
   */
  find: async (req, res) => {
    try {
      let result = await IHSData.find({}).select("-__v");

      res.status(200).json({ success: true, result });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: `Can't get ihsdata`, error });
    }
  },

  /**
   * Add new ihsdata to database
   * @param req Request to the server
   * @param res Response from the server
   */
  post: async (req, res) => {
    var contentBody = req.body;
    try {
      var newIHSData = new IHSData(contentBody);

      let result = await newIHSData.save();

      res.status(201).json({ success: true, result });
    } catch (error) {
      res.status(501).json({
        success: false,
        message: `Unable to add new ihs data`,
        error,
      });
    }
  },

  /**
   * Delete a ihsdata from database
   * @param req Request to the server
   * @param res Response from the server
   */
  delete: (req, res) => {
    IHSData.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) => res.status(500).json({ success: false, error }));
  },

  /**
   * Update a ihsdata from database
   * @param req Request to the server
   * @param res Response from the server
   */
  update: (req, res) => {
    let newData = req.body;
    let final = {};
    for (let key in newData) {
      if (newData[key] !== "") {
        final[key] = newData[key];
      }
    }
    IHSData.updateOne({ _id: req.params.id }, { $set: final })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: "Unable to update ihs data" })
      );
  },
};

module.exports = ihsdataService;

const SiteInfo = require("../model/SiteInfo");

const siteinfoService = {
  /**
   * Get all siteinfos from database
   * @param req Request to the server
   * @param res Response from the server
   */
  findOne: async (req, res) => {
    try {
      let result = await SiteInfo.findById(req.params.id).select("-__v");

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Site Info not found!" });
      }
      res.status(200).json({ success: true, result });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: `Can't get site info`, error });
    }
  },

  /**
   * Get all siteinfos from database
   * @param req Request to the server
   * @param res Response from the server
   */
  find: async (req, res) => {
    try {
      let result = await SiteInfo.find({}).select("-__v");

      res.status(200).json({ success: true, result });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: `Can't get site infos`, error });
    }
  },

  /**
   * Add new siteinfo to database
   * @param req Request to the server
   * @param res Response from the server
   */
  post: async (req, res) => {
    var contentBody = req.body;
    try {
      var newSiteInfo = new SiteInfo(contentBody);

      let result = await newSiteInfo.save();

      res.status(201).json({ success: true, result });
    } catch (error) {
      res.status(501).json({
        success: false,
        message: `Unable to add new site info`,
        error,
      });
    }
  },

  /**
   * Delete a siteinfo from database
   * @param req Request to the server
   * @param res Response from the server
   */
  delete: (req, res) => {
    SiteInfo.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) => res.status(500).json({ success: false, error }));
  },

  /**
   * Update a siteinfo from database
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
    SiteInfo.updateOne({ _id: req.params.id }, { $set: final })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: "Unable to update site info" })
      );
  },
};

module.exports = siteinfoService;

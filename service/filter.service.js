const Filter = require("../model/Filter");

const filterService = {
  /**
   * Get all filters from database
   * @param req Request to the server
   * @param res Response from the server
   */
  findOne: async (req, res) => {
    try {
      let result = await Filter.findById(req.params.id).select("-__v");

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Filter not found!" });
      }
      res.status(200).json({ success: true, result });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: `Can't get filters`, error });
    }
  },

  /**
   * Get all filters from database
   * @param req Request to the server
   * @param res Response from the server
   */
  find: async (req, res) => {
    try {
      let result = await Filter.find({}).select("-__v");

      res.status(200).json({ success: true, result });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: `Can't get filters`, error });
    }
  },

  /**
   * Add new filter to database
   * @param req Request to the server
   * @param res Response from the server
   */
  post: async (req, res) => {
    var contentBody = req.body;
    try {
      var newFilter = new Filter(contentBody);

      let result = await newFilter.save();

      res.status(201).json({ success: true, result });
    } catch (error) {
      res.status(501).json({
        success: false,
        message: error.message ? error.message : "Unable to add new filter",
        // error,
      });
    }
  },

  /**
   * Delete a filter from database
   * @param req Request to the server
   * @param res Response from the server
   */
  delete: (req, res) => {
    Filter.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) => res.status(500).json({ success: false, error }));
  },

  /**
   * Update a filter from database
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
    Filter.updateOne({ _id: req.params.id }, { $set: final })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: "Unable to update filter" })
      );
  },
};

module.exports = filterService;

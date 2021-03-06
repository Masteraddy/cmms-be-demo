const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3030;

const userRoute = require("./routes/user.routes");
const authRoute = require("./routes/auth.routes");
const usersRoute = require("./routes/users.routes");
const serviceRoute = require("./routes/service.routes");
const requestRoute = require("./routes/request.routes");
const requestOutRoute = require("./routes/requestout.routes");
const propertyRoute = require("./routes/property.routes");
const locationRoute = require("./routes/location.routes");
const equipmentRoute = require("./routes/equipment.routes");
const inventoryRoute = require("./routes/inventory.routes");
const inspectionRoute = require("./routes/inspection.routes");
const csRoute = require("./routes/cs.routes");
const assetRoute = require("./routes/asset.routes");
const ppmRoute = require("./routes/ppm.routes");

// New Routes Import
const filterRoute = require("./routes/filter.routes");
const siteInfoRoute = require("./routes/siteinfo.routes");
const regionInfoRoute = require("./routes/regioninfo.routes");
const ihsDataRoute = require("./routes/ihsdata.routes");

//MongoDB Options
const db = require("./config/keys").MongoURI;
const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

//Middle Wares
/** For Cross Origin Resource Sharing (CORS)*/
app.use(cors());

app.use(express.json());

//Connect to Database
mongoose
  .connect(db, option)
  .then(() => console.log("MongoDb Connected..."))
  .catch((err) => console.log(err));

//Connect to routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/service", serviceRoute);
app.use("/api/request", requestRoute);
app.use("/api/requestout", requestOutRoute);
app.use("/api/property", propertyRoute);
app.use("/api/location", locationRoute);
app.use("/api/equipment", equipmentRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/inspection", inspectionRoute);
app.use("/api/asset", assetRoute);
app.use("/api/cs", csRoute);
app.use("/api/ppm", ppmRoute);

// New Routes Implemented
app.use("/api/filter", filterRoute);
app.use("/api/siteinfo", siteInfoRoute);
app.use("/api/regioninfo", regionInfoRoute);
app.use("/api/ihsdata", ihsDataRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("*", (req, res) => {
  res
    .status(404)
    .json({ status: false, message: "Sorry, Api Does Not Exist!!!" });
});

app.listen(port, () =>
  console.log(`The server is running at http://localhost:${port}`)
);

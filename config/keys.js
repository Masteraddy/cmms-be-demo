const MongoURI = process.env.MONGO_URI || "mongodb://localhost/grey-test";
// "mongodb+srv://greentest:greentest@cluster0.chydu.mongodb.net/sostein?retryWrites=true&w=majority";

module.exports = {
  MongoURI,
  jwtSecret: "anythingIsSecret",
};

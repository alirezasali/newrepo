let aggregationCommands = [
  // { $match: {gt:{_id:"<last id >"}} },
  { $limit: 10 },
  {
    $project: {
      //"_id":0,
      "_id":"$profileDetails.basicDetails.customerCode",
      "name":"$profileDetails.basicDetails.customerFullName",
      "status":"$profileDetails.profileStatus.masterCode",
      "customerCategory":"$profileDetails.customerCategory.masterCode",
      "customerSubCategory":"$profileDetails.customerSubCategory.masterCode",
      "customerType":"$profileDetails.customerType.masterCode",
      "riskCategory":"$profileDetails.riskDetails.riskCategory.masterCode",
      "xDir":"$profileDetails.xDirLevel.masterCode",
      "createdDate":"$profileDetails.createdDate",
      //"modifiedDate":"$profileDetails.modifiedDate",
      "account._id":"barbar ba khoroojie as dar lookup",
      "account.name":"barbar ba meghdare khorojuke look"
    },
  },
];
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/users",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to MongoDB");
  let CLM_Profile = mongoose.model("Modal", new mongoose.Schema({}), "CLM_Profile");
  var query = CLM_Profile.aggregate(aggregationCommands).option({
    allowDiskUse: true,
  });
  query
    .cursor({ batchSize: 100 })
    .exec()
    .on("data", (data) => {
      db
        .collection("customer")
        .insert(data)
        .then((r) =>
          console.log(JSON.stringify(r, null, 2), "inserted" + data._id)
        );
    })
    .on("end", () => console.log("data ended"));
});

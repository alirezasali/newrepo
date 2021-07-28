var batchSize=100;
let aggregationCommands = [
  // { $match: {gt:{_id:"<last id >"}} },
  { $limit: 10 },
  {
    $project: {
      //"_id":0,
      "_id": "$profileDetails.basicDetails.customerCode",
      "name": "$profileDetails.basicDetails.customerFullName",
      "status": "$profileDetails.profileStatus.masterCode",
      "customerCategory": "$profileDetails.customerCategory.masterCode",
      "customerSubCategory": "$profileDetails.customerSubCategory.masterCode",
      "customerType": "$profileDetails.customerType.masterCode",
      "riskCategory": "$profileDetails.riskDetails.riskCategory.masterCode",
      "xDir": "$profileDetails.xDirLevel.masterCode",
      "createdDate": "$profileDetails.createdDate",
      //"modifiedDate":"$profileDetails.modifiedDate",
      "account._id": "barbar ba khoroojie as dar lookup",
      "account.name": "barbar ba meghdare khorojuke look"
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
var myoutput=[];
function insertifready(force) {
  if(!force &&  myoutput.length<=100) return ;
  let insertvar = myoutput.slice(0,batchSize);
   myoutput = myoutput.slice(batchSize);
  db
    .collection("customer")
    .insertMany(insertvar)
    .then((r) => {
      console.log(r);
    });
}

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to MongoDB");
  let CLM_Profile = mongoose.model("Modal", new mongoose.Schema({}), "CLM_Profile");
  var query = CLM_Profile.aggregate(aggregationCommands).option({
    allowDiskUse: true,
  });
  query
    .cursor({ batchSize })
    .exec()
    .on("data", (data) => {
      myoutput.push(data)
      insertifready()
      // console.log(data);

    })
    .on("end", () => (insertifready(true),console.log("data ended")));
});

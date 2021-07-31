//variables defination
var batchSize = 4;
var output = [];
var inputConnectionStr = "mongodb://localhost:27017/users";
var outputConnectionStr = "mongodb://localhost:27017/datadata";
var inputCollection = "CLM_Profile";
var outputCollection = "customer";
let aggregationCommands = [
  { $limit: 20 },
  {
    $lookup: {
      from: "CLM_BillingAccount",
      localField: "profileDetails.basicDetails.customerCode",
      foreignField: "billingAccount.customerCode",
      as: "accountstore"
    }
  }, {
    $unwind: { path: "$accountstore", preserveNullAndEmptyArrays: true }
  },
  {
    $project: {
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
      "account._id": "$accountstore.billingAccount.accountCode",
      "account.name": "$accountstore.billingAccount.accountOwnerDetails.customerFullName"
    },

  },

];


//connection defination
const mongoose = require("mongoose");
var conn1 = mongoose.createConnection(inputConnectionStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var conn2 = mongoose.createConnection(outputConnectionStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let connectionpromise = new Promise(r => conn2.once('open', r));

conn1.on("error", console.error.bind(console, "connection error:"));
conn1.once("open", async function () {
  console.log("yes we connected");

//Query Statement
  try {
    var cursor = conn1.db.collection(inputCollection)
      .aggregate(aggregationCommands, { allowDiskUse: true }, { cursor: { batchSize } });


    while (await cursor.hasNext()) {
      var doc = await cursor.next();
      output.push(doc);
      await connectionpromise;
      if (output.length >= batchSize) {
        //Insert Statement
        try{
          let result = await conn2.db.collection(outputCollection).insertMany(output);
          console.log('succeed',JSON.stringify(result, null, 2));
          console.log("-".repeat(50));

          output = [];
        }catch(e){
          console.error('failed',e);
        }
        
      }
    };

  } catch (e) {
    console.error(e);
  }
});

//get env results to connect to configCollection
var queryConnectionStr = process.env.CONFIG_DB_CONN_STR;
var queryCollection = process.env.COLLECTION_NAME;
var queryOutputCollection = process.env.FIND_OUTPUT_COLLECTION;


var startDate = new Date();

//variables defination

var output = [];

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
//let qincollstr
const mongoose = require("mongoose");
(async function () {
  const config = await new Promise((res, rejj) => {


    var queryconn = mongoose.createConnection(queryConnectionStr, {
      useNewUrlParser: true, useUnifiedTopology: true
    });

    queryconn.on("error", console.error.bind(console, "connection error:"));
    queryconn.once("open", async function () {
      console.log("the first connection to config collection for fetch data is ok ")
      console.log(queryOutputCollection);
      queryconn.db.collection(queryCollection).findOne({ "outputCollection": queryOutputCollection}, function (err, doc) {
        if (err || !doc) return rejj(console.log('no' + queryOutputCollection + " found on " + queryOutputCollection + " on collection " + queryCollection));
        res(doc);
        console.log("-".repeat(20) + "data fetched from config collection" + "-".repeat(20));

      });
    });
  })
//return console.log(config);

  var middletDate = new Date();
  var secondsAfterFirstQuery = (middletDate.getTime() - startDate.getTime()) / 1000;

  //connection defination

  var conn1 = mongoose.createConnection(config.inputConnectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  var conn2 = mongoose.createConnection(config.outputConnectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let connectionpromise = new Promise(r => conn2.once('open', r));

  conn1.on("error", console.error.bind(console, "connection error:"));
  conn1.once("open", async function () {
    console.log("yes we connected");

    //Query Statement
    try {
      var cursor = conn1.db.collection(config.inputCollection)
        .aggregate(config.aggregationCommands, { allowDiskUse: true }, { cursor: { batchSize: config.configurations.batchsize} });


      while (await cursor.hasNext()) {
        var doc = await cursor.next();
        output.push(doc);
        await connectionpromise;
        if (output.length >= config.configurations.batchsize) {
          //Insert Statement
          try {
            let result = await conn2.db.collection(config.outputCollection).insertMany(output);
            console.log('succeed', JSON.stringify(result, null, 2));
            console.log("-".repeat(50));

            output = [];
          } catch (e) {s
            console.error('failed', e);
          }

        }
      };

    } catch (e) {
      console.error(e);
    }
  });
  var endDate = new Date();
  var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  console.log("time to run all: " + seconds);
  console.log("time to run first part: " + secondsAfterFirstQuery);
  console.log(queryOutputCollection);
})();

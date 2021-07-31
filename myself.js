var batchSize = 100;
let aggregationCommands = [
  // { $match: {gt:{_id:"<last id >"}} },
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
      "account._id": "$accountstore.billingAccount.customerCode",
      "account.name": "$accountstore.billingAccount.accountOwnerDetails.customerFullName"
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


mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", async function () {
  console.log("yes we connected")
  try {
    var cursor = await mongoose.connection.db.collection("CLM_Profile")
      .aggregate(aggregationCommands, { allowDiskUse: true },{cursor: { batchSize: 4 }}).batchSize(3);
      
      /*for(let doc = await cursor.next(); doc != null; doc = await cursor.next()){
        console.log("-".repeat(50));
        console.log(doc);
        console.log(cursor.objsLeftInBatch)
      }*/
        
        while (await cursor.hasNext() ) {
        var doc = await cursor.next();
        console.log(doc);  
        console.log("-".repeat(50)); 
         };
        var exx =  cursor.objsLeftInBatch((r)=> console.log(r));
        console.log(exx);
        
          /*cursor.forEach( (doc) => {

            console.log('doc:', doc);
            console.log("-".repeat(50));
                  
              });*/
              
      
        
 
  
  } catch (e) {
    console.error(e)}
  });

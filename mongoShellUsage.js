var batchSize = 100;
let aggregationCommands = [
  // { $match: {gt:{_id:"<last id >"}} },
  { $limit: 12 },
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
    }
  }

];
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/users",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
/*const db = mongoose.connection;
var myoutput=[];
function insertifready(force) {
  //console.log(myoutput);
  if(!force &&  myoutput.length<=100) return ;
  let insertvar = myoutput.slice(0,batchSize);
   myoutput = myoutput.slice(batchSize);
  db
    .collection("customer")
    .insertMany(insertvar)
    .then((r) => {
      //console.log(r);
      console.log(JSON.stringify(r, null, 2))
    });
}
*/
//const db = mongoose.connection;


mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", async function () {
  console.log("yes we connected")
  try {
    var cursor =  mongoose.connection.db.collection("CLM_Profile")
      .aggregate(aggregationCommands, { allowDiskUse: true},{cursor: { batchSize: 4 }}).batchSize(4)
      ;

    for await (const doc of cursor){
      console.log('-'.repeat(20))
      console.log(doc)
    }

    // while(await cursor.hasNext()) {

    //   // let batch = await cursor.toArray();
      
    //   console.log("|".repeat(10));
    //   // mongoose.connection.db
    //   //   .collection("customer")
    //   //   .insertMany(batch)
    //   cursor.next();
    //   // if (await cursor.hasNext()) await cursor.next();
    //   // else break;
    // } 
  } catch (e) {
    console.error(e)
  }
}
);





/*

async function(){
try{
  let cursor = await  db.collection("alie").aggregate(aggregationCommands,{
    allowDiskUse:true,
    cursor:100
  });
  while(cursor.hasNext()){
    // await =insertmany
    cursor.next();

  }
}catch(e){
  console.error(e)
}
}
function(){
  return new Promise((res,rej)=>{})
}*/
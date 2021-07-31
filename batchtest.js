var batchSize=100;
let aggregationCommands = [
  // { $match: {gt:{_id:"<last id >"}} },
  { $limit: 2 },
  {
    $lookup: {   
      from: "CLM_BillingAccount",
      localField: "profileDetails.basicDetails.customerCode",
      foreignField: "billingAccount.customerCode",
      as: "accountstore"
    }
  },{
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
const db = mongoose.connection;
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

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to MongoDB");
  let CLM_Profile = mongoose.model("Modal", {}, "CLM_Profile");
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
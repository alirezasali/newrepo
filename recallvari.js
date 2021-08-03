console.log("during:", new Date());
var startDate = new Date();

const booi = 'mano nakhor';
const nami = process.env.CONFIG_DB_CONN_STR;
var queryCollection = process.env.COLLECTION_NAME;
console.log(nami);
let vasl; 
const namio = Number(process.env.CONFIG_ID);

const mongoose = require("mongoose");
mongoose.connect(nami, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("yes we connected ");

db.db.collection(queryCollection).findOne({_id: namio},function (err,doc){
    console.log("this is>"+process.env.CONFIG_ID+"<this is");
    vasl =doc.inputConnectionStr;
    console.log(vasl);
    var koli = doc.configurations.batchsize
    console.log(koli);
    var collectionesh =doc.inputCollection;
    console.log(collectionesh);
    var outvasl =doc.outputConnectionStr;
    console.log(outvasl);

    var outcollectionesh =doc.outputCollection;
    console.log(outcollectionesh);
    var aggcommand =doc.aggregationCommands;
    console.log(aggcommand);
    
  // console.log(doc)
})





});


var endDate   = new Date();
var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
console.log("time to run: "+ seconds);
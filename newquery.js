let aggregationCommands = [
  // { $match: {gt:{_id:"<last id >"}} },
  { $limit: 10 },
  {
    $project: {
      _id: 0,
      "newobj.babak": "$profileDetails.profileStatus.masterCode",
    },
  },
];
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://root:h0ts8yOd0S@10.130.17.146:30055/dclm_sbox?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to MongoDB");
  let CLM_Profile = mongoose.model("Modal", new mongoose.Schema({}), "Profile");
  var query = CLM_Profile.aggregate(aggregationCommands).option({
    allowDiskUse: true,
  });
  query
    .cursor({ batchSize: 100 })
    .exec()
    .on("data", (data) => {
      mongoose.connection.db
        .collection("userCollection")
        .insert(data)
        .then((r) =>
          console.log(r, "inserted" + data._id)
        );
    })
    .on("end", () => console.log("data ended"));
});

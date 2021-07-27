let sampledata = {
  //"_id" : ObjectId("588f42e8e4b0399a28c2bdd3"),
  profileDetails: {
    customerCategory: {
      masterCode: "PRECAT1",
    },
    customerSubCategory: {
      masterCode: "PRESCAT1",
    },
    customerType: {
      masterCode: "I",
    },
    profileStatus: {
      masterCode: "ACT",
    },
    xDirLevel: {
      masterCode: 1,
    },
    riskDetails: {
      riskCategory: {
        masterCode: "1",
      },
    },
    //"activationDate" : ISODate("2017-01-30T12:42:40Z"),
    //"createdDate" : ISODate("2017-01-30T12:42:37Z"),
    basicDetails: {
      VIP: "N",
      country: {
        masterCode: "",
      },
      customerCode: "C8064210950",
      customerFullName: "FSDFSD FSDGFSDG",
      //"dateOfBirth" : ISODate("1921-04-23T00:00:00Z"),
      duplicateCheckStatus: "Passed",
      firstName: "FSDFSD",
      gender: {
        masterCode: "M",
      },
      highestQualification: {
        masterCode: "BHE",
      },
      idCheckStatus: "Passed",
      incomeRange: {
        masterCode: "0",
      },
      lastName: "FSDGFSDG",
      fatherName: "fsdgfsdgf",
      emailAddress: "sdfs@fsf.com",
      telephoneHome: "05656-66666666",
      telephoneWork: "",
      faxNumberHome: "",
      jobTitle: "",
      degree: {
        masterCode: "BHE",
      },
      middleName: "",
      nationality: {
        masterCode: "IRN",
      },
      title: {
        masterCode: "MR",
      },
      occupationalDetails: {
        occupation: {
          masterCode: "SE_TST",
        },
        organizationContactNumber: "",
        organizationName: "",
      },
    },
    notificationDetails: {
      isDNDApplicable: "N",
      preferredLanguage: {
        masterCode: "E",
      },
      preferredMedium: {
        emailId: "sdfs@fsf.com",
        faxNo: "",
        landlinePhoneNo: "05656-66666666",
        mobileNo: "9339902222",
        isContactByEmail: "Y",
        isContactByFax: "N",
        isContactByPhone: "N",
        isContactByPost: "N",
        isContactBySms: "N",
      },
    },
    identificationDetails: {
      identificationDetail: [
        {
          documentPurpose: {
            masterCode: "POID",
          },
          idNumber: "830088009",
          idType: {
            masterCode: "NATID",
          },
        },
      ],
    },
    registrationDetails: {
      userDetails: {
        userName: "abillity",
        loginName: "abillity",
      },
      salesChannel: {
        masterCode: "abillity",
      },
      // "registrationDate" : ISODate("2017-01-30T12:42:37Z")
    },
    addresses: {
      addressDetails: [
        {
          addressFormat: "POSA",
          addressType: {
            masterCode: "Residence",
          },
          apartment: "",
          buildingNumber: "252",
          building: "",
          floor: "",
          locality: "U",
          provinceName: "province1",
          streetName: "heravi",
          cityName: "tehran",
          districtName: "",
          postalCode: "1333333333",
        },
        {
          addressFormat: "POSA",
          addressType: {
            masterCode: "Permanent",
          },
          apartment: "",
          buildingNumber: "252",
          building: "",
          floor: "",
          locality: "U",
          province: {
            masterCode: "province1",
          },
          streetName: "dfsdfsd",
          cityName: "city1",
          districtName: "",
          postalCode: "5699153",
        },
      ],
    },
  },
};


let fieldname = {
  "_id":0,
   "profileDetails.basicDetails.customerCode":1,
   "profileDetails.basicDetails.customerFullName":1,
   "profileDetails.profileStatus.masterCode":1,
   "profileDetails.customerCategory.masterCode":1,
   "profileDetails.customerSubCategory.masterCode":1,
   "profileDetails.customerType.masterCode":1,
   "profileDetails.riskDetails.riskCategory.masterCode":1,
   "profileDetails.xDirLevel.masterCode":1,
   "profileDetails.createdDate":1
   
}

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/users",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to MongoDB");
  const mySchema = new mongoose.Schema({});
  let CLM_Profile = mongoose.model("Modal", mySchema, "CLM_Profile");
  var query = CLM_Profile.aggregate([
    { $match: { } },
    {$limit: 1},
    {$project: fieldname }
  ]);
  query.exec(function (err, data) {
    if (err) throw err;
    console.log(JSON.stringify(data, null, 2));
  });
  const stream = require('stream');
  let mystream = new stream();
  const myarray = []
  query.mystream().pip(function (err, value){
    if (err) throw err;
    myarray.push(value);
  });

  

});

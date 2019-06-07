const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'jeopardy';

// Create a new MongoClient
const client = new MongoClient(url,{useNewUrlParser:true});

var db; //Global variable to be used by various methods

//Establish a connection to the database
client.connect(function(err) {
  if(err==null) console.log("Connected successfully to server");
  else { console.log("Error:"+err); process.exit(1);}
  db = client.db(dbName);
  insertDocuments(db); //optionally insert stub data

});

var jeopardy = [{
    "category":"HTML",
    "100q":"HTML 100 Question",
    "100a":"HTML 100 Answer",
    "200q":"HTML 200 Question",
    "200a":"HTML 200 Answer",
    "300q":"HTML 300 Question",
    "300a":"HTML 300 Answer",
    "400q":"HTML 400 Question",
    "400a":"HTML 400 Answer",
    "500q":"HTML 500 Question",
    "500a":"HTML 500 Answer"
  }, {
    "category":"CSS",
    "100q":"CSS 100 Question",
    "100a":"CSS 100 Answer",
    "200q":"CSS 200 Question",
    "200a":"CSS 200 Answer",
    "300q":"CSS 300 Question",
    "300a":"CSS 300 Answer",
    "400q":"CSS 400 Question",
    "400a":"CSS 400 Answer",
    "500q":"CSS 500 Question",
    "500a":"CSS 500 Answer"
  }, {
    "category":"JavaScript",
    "100q":"JavaScript 100 Question",
    "100a":"JavaScript 100 Answer",
    "200q":"JavaScript 200 Question",
    "200a":"JavaScript 200 Answer",
    "300q":"JavaScript 300 Question",
    "300a":"JavaScript 300 Answer",
    "400q":"JavaScript 400 Question",
    "400a":"JavaScript 400 Answer",
    "500q":"JavaScript 500 Question",
    "500a":"JavaScript 500 Answer"
  }, {
    "category":"JQuery",
    "100q":"JQuery 100 Question",
    "100a":"JQuery 100 Answer",
    "200q":"JQuery 200 Question",
    "200a":"JQuery 200 Answer",
    "300q":"JQuery 300 Question",
    "300a":"JQuery 300 Answer",
    "400q":"JQuery 400 Question",
    "400a":"JQuery 400 Answer",
    "500q":"JQuery 500 Question",
    "500a":"JQuery 500 Answer"
  }, {
    "category":"NodeJS",
    "100q":"NodeJS 100 Question",
    "100a":"NodeJS 100 Answer",
    "200q":"NodeJS 200 Question",
    "200a":"NodeJS 200 Answer",
    "300q":"NodeJS 300 Question",
    "300a":"NodeJS 300 Answer",
    "400q":"NodeJS 400 Question",
    "400a":"NodeJS 400 Answer",
    "500q":"NodeJS 500 Question",
    "500a":"NodeJS 500 Answer"
  }, {
    "category":"Mongo",
    "100q":"Mongo 100 Question",
    "100a":"Mongo 100 Answer",
    "200q":"Mongo 200 Question",
    "200a":"Mongo 200 Answer",
    "300q":"Mongo 300 Question",
    "300a":"Mongo 300 Answer",
    "400q":"Mongo 400 Question",
    "400a":"Mongo 400 Answer",
    "500q":"Mongo 500 Question",
    "500a":"Mongo 500 Answer"
  }, {
  "category":"login",
  "user":"cs290",
  "pass":"spring"
  }
];


const insertDocuments = function(db) {
  const collection = db.collection('jeopardy');
  //db.dropDatabase();
  console.log("Count="+collection.find({}).count());
  collection.countDocuments({},function(err,numRecords) {
    console.log("total count right now = "+numRecords);
    if(numRecords==0) {
      //insert documents
        collection.insertMany(jeopardy, function(err, result) {
        console.log("Inserted "+result.result.n+ " documents");
      });
    } else {
      console.log(numRecords+ " documents found. No need to auto insert documents");
    }
  });
}

const findDocuments = function(req,res) {
  //const db = client.db(dbName);
  const collection = db.collection('jeopardy');
  // Find all documents
  collection.find({}).toArray(function(err, docs) {
    if(err!=null) {
      console.log("There was an error:"+err);
    }
    console.log("Number of records found:"+docs.length);
    res.send(docs);
  });
}

const findOne = function(req,res) {
  const collection = db.collection('jeopardy');
  console.log("Looking for category:"+req.query.name);
  collection.findOne({"category":req.query.name}, function(err,result) {
    if(!err && result) res.send(result);
    else {
        res.send({"error":"category not found"});
    }
  })
}

const addCategory = function(req,res) {
    var newrec={};
    newrec.country=req.body.country;
    newrec.notation=req.body.notation;
    newrec.currency=req.body.currency;
    newrec.commission=req.body.commission;
    newrec.multiplier=req.body.multiplier;
    var country = newrec.country;

    //console.log(JSON.stringify(newrec)); //alsotry console.log(req.body);
    const collection = db.collection('jeopardy');
    collection.update({"country":country},newrec,{upsert :true}, function(err, result) {
            if (err) {
                console.log({"Error":err});
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.send(result);
                //res.end();
            }
        });
}


module.exports.findAll = findDocuments;
module.exports.findOne = findOne;
module.exports.addCategory = addCategory;

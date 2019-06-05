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
  "category":"html",
  "question":"question this is",
  "value":"10",
  "answer":"the answer",
  }, {
  "category":"html",
  "question":"question this is",
  "value":"100",
  "answer":"the answer",
  }
];

const insertDocuments = function(db) {
  const collection = db.collection('rates');
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
  const collection = db.collection('rates');
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
  const collection = db.collection('rates');
  console.log("Looking for category:"+req.query.name);
  collection.findOne({"category":req.query.name}, function(err,result) {
    if(!err && result) res.send(result);
    else {
        res.send({"error":"category not found"});
    }
  })  
}

//an example of a post request
const findCategory = function(req,res) {
  const collection = db.collection('rates');
  collection.findOne({"category":req.body.name}, function(err,result) {
    if(!err && result) res.send(result);
    else {
        res.send({"error":"category not found"});
    }
  })
}

//This one uses the category name as part of the url
const findACategory = function(req,res) {
  const collection = db.collection('rates');
  collection.findOne({"category":req.params.category}, function(err,result) {
    if(!err && result) res.send(result);
    else {
        res.send({"error":"category not found"});
    }
  })
}

const addCategory = function(req,res) {
    var newrec={};
    newrec.category=req.body.category;
    newrec.question=req.body.question;
    newrec.value=req.body.value;
    newrec.answer=req.body.answer;
    var category = newrec.category;

    //console.log(JSON.stringify(newrec)); //alsotry console.log(req.body);
    const collection = db.collection('rates');
    collection.update({"category":category},newrec,{upsert :true}, function(err, result) {
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
module.exports.addCategory = addCategory();
module.exports.findCategory = findCategory();
module.exports.findACategory = findACategory();
var DB = require('mongodb').MongoClient;

/**
 * Function for connect to MongoDB
 * @param {string} _db database name 
 * @param {function} callBack callback for work after connect 
 */
async function Connect(dbName, callBack) {
    var url = 'mongodb://localhost:27017';
    await DB.connect(url, async (err, client) => {
        if (err) return console.log('DB not connect! ' + err.toString());
        await callBack(client.db(dbName));
        client.close();
        return;
    });
}

/**
 * Function for find items in db
 * @param {string} _db database name 
 * @param {string} coll collection name
 * @param {object} predic predicate for find items
 * @param {function} userFunc call back 
 */
function Find(_db, coll, predic, userFunc) {
    Connect(_db, AfterConnect);

    /**
     * Function for callback after connect
     * @param {object} db db handler 
     */
    function AfterConnect(db) {
        db.collection(coll).find(predic).toArray((err, res) => {
            if (err) return console.log('Find error! ' + err.toString());
            userFunc(res);
            return;
        });
    }
}

/**
 * Function for find one object on db
 * @param {string} _db database name 
 * @param {string} coll collection name
 * @param {object} predic predicate for find items
 * @param {function} userFunc call back 
 */
function FindOne(_db, coll, predic, userFunc) {
    Connect(_db, AfterConnect);

    /**
     * Function for callback after connect
     * @param {object} db db handler 
     */
    function AfterConnect(db) {
        db.collection(coll).findOne(predic, (err, res) => {
            if (err) return console.log('Find error! ' + err.toString());
            userFunc(res);
            return;
        });
    }
}

/**
 * Function for insert many objects to db
 * @param {string} _db database name 
 * @param {string} coll collection name
 * @param {array} obj array of objects who will add to database
 * @param {function} userFunc callback whose will call after insert finish
 */
function InsertMany(_db, coll, obj, userFunc = null) {
    Connect(_db, AfterConnect);

    /**
     * Function for callback after connect
     * @param {object} db db handler 
     */
    function AfterConnect(db) {
        db.collection(coll).insertMany(obj, (err, res) => {
            if (err) return console.log('Insert error! ' + err.toString());
            if (userFunc != null) userFunc(res);
            return;
        });
    }
}

/**
 * Function for insert one objects to db
 * @param {string} _db database name 
 * @param {string} coll collection name
 * @param {object} obj object who will add to database
 * @param {function} userFunc callback whose will call after insert finish
 */
function InsertOne(_db, coll, obj, userFunc = null) {
    Connect(_db, AfterConnect);

    /**
     * Function for callback after connect
     * @param {object} db db handler 
     */
    function AfterConnect(db) {
        db.collection(coll).insertOne(obj, (err, res) => {
            if (err) return console.log('Insert error! ' + err.toString());
            if (userFunc != null) userFunc(res);
            return;
        });
    }
}

/**
 * Function for delete many object from db
 * @param {string} _db database name 
 * @param {string} coll collection name
 * @param {object} predic predicate for find items
 * @param {function} userFunc call back 
 */
function DeleteMany(_db, coll, predic, userFunc = null) {
    Connect(_db, AfterConnect);

    /**
     * Function for callback after connect
     * @param {object} db db handler 
     */
    function AfterConnect(db) {
        db.collection(coll).deleteMany(predic, (err, res) => {
            if (err) return console.log('Delete error! ' + err.toString());
            if (userFunc != null) userFunc(res);
            return;
        });
    }
}

/**
 * Function for delete one object from db
 * @param {string} _db database name 
 * @param {string} coll collection name
 * @param {object} predic predicate for find items
 * @param {function} userFunc call back 
 */
function DeleteOne(_db, coll, predic, userFunc = null) {
    Connect(_db, AfterConnect);

    /**
     * Function for callback after connect
     * @param {object} db db handler 
     */
    function AfterConnect(db) {
        db.collection(coll).deleteOne(predic, (err, res) => {
            if (err) return console.log('Delete error! ' + err.toString());
            if (userFunc != null) userFunc(res);
            return;
        });
    }
}

/**
 * Function for update many documents on db
 * @param {object} _db 
 * @param {string} coll 
 * @param {object} predic 
 * @param {object} updateValue 
 * @param {function} userFunc 
 */
function UpdateMany(_db, coll, predic, updateValue, userFunc = null) {
    Connect(_db, AfterConnect);

    /**
     * Function for callback after connect
     * @param {object} db db handler 
     */
    function AfterConnect(db) {
        db.collection(coll).updateMany(predic, { $set: updateValue }, (err, res) => {
            if (err) return console.log('Update error! ' + err.toString());
            if (userFunc != null) userFunc(res);
            return;
        });
    }
}

/**
 * Function for update one document on db
 * @param {object} _db 
 * @param {string} coll 
 * @param {object} predic 
 * @param {object} updateValue 
 * @param {function} userFunc 
 */
function UpdateOne(_db, coll, predic, updateValue, userFunc = null) {
    Connect(_db, AfterConnect);

    /**
     * Function for callback after connect
     * @param {object} db db handler 
     */
    function AfterConnect(db) {
        db.collection(coll).updateOne(predic, updateValue, (err, res) => {
            if (err) return console.log('Update error! ' + err.toString());
            if (userFunc != null) userFunc(res);
            return;
        });
    }
}

/**
 * Save current database to file (make backup)
 * @param {string} db database name 
 * @param {string} path path to file 
 */
function SaveDB(db, path) {
    let DBObject = {},
        coll = [],
        dbName = db,
        fs = require('fs');
    Connect(db, AfterConnect);

    /**
     * After connect db, get all collections
     * @param {object} db 
     */
    async function AfterConnect(db) {
        await db.collections(async (err, result) => {
            if (err) return console.log('get collections error!');
            for (let i = 0; i < result.length; i++) {
                coll.push(result[i].s.name.toString());
            }
            Connect(dbName, GetValues);
        });
    }

    /**
     * Get all values of this collections
     * @param {object} db 
     */
    async function GetValues(db) {
        for (let i = 0; i < coll.length; i++) {
            await db.collection(coll[i]).find({}).toArray(async (findErr, findResult) => {
                if (findErr) return console.log(findErr)
                DBObject[coll[i]] = findResult;
                if (i == coll.length - 1) SaveToFile(DBObject);
            });
        }       
    }

    /**
     * Save db backup to file
     * @param {obejct} result 
     */
    function SaveToFile(result) {
        fs.writeFile(path, JSON.stringify(result), (err) => {
            if (err) return console.log(err);
            else console.log('backup is create');
        });
    }
} 

/**
 * Function for repair db from file
 * @param {string} dbName database name
 * @param {string} path path to file where save backup
 */
function RepairFromBackup(dbName, path) {
    let obj = null,
        fs = require('fs');

    /**
     * Read file async
     */
    fs.readFile(path, (err, data) => {
        if (err) return console.log(err);
        try {
            obj = JSON.parse(data);
        } catch(e) {
            return console.log(e);
        }
        CreateCollections(obj);
    });

    /**
     * Function for make collections and save backup data
     * @param {object} obj 
     */
    function CreateCollections(obj) {
        let coll = Object.keys(obj);
        Connect(dbName, async (db) => {
            // create collections
            for (let i = 0; i < coll.length; i++) {
                await db.createCollection(coll[i]);
            }
            // save backup data
            for (key in obj) {
                if (obj[key].length > 0) {
                    await db.collection(key).insertMany(obj[key]);
                }
            }
        });
    }

}

module.exports.Find = Find;
module.exports.FindOne = FindOne;
module.exports.InsertMany = InsertMany;
module.exports.InsertOne = InsertOne;
module.exports.DeleteMany = DeleteMany;
module.exports.DeleteOne = DeleteOne;
module.exports.UpdateMany = UpdateMany;
module.exports.UpdateOne = UpdateOne;
module.exports.SaveDB = SaveDB;
module.exports.RepairFromBackup = RepairFromBackup;
const path = require('path'),
      fs   = require('fs');

const config = require('../config/config'),
      db     = require('../private/db'),
      model  = {
            user: require('../models/user')
      };

function find(req, res) {
    db.Find(config.dbName, 'users', {}, (result) => {
		let responseText;
		try {
			responseText = JSON.stringify(result);
		} catch(e) {
			return sendError(res);
		}
		res.statusCode = 200;
		res.end(responseText);
	});
}
function insert(req, res) {
	parsePostData(req, insertData);

	function insertData(data) {
		let name    = null,
			age     = null,
			country = null,
			phone   = null,
			type    = null,
			userModel   = null;
		data.forEach(item => {
			if (item[0] === 'name')    name = item[1];
			if (item[0] === 'age')     age = item[1];
			if (item[0] === 'country') country = item[1];
			if (item[0] === 'phone')   phone = item[1];
			if (item[0] === 'type')    type = item[1];
		});
		if (
			name    == null ||
			age     == null ||
			country == null ||
			phone   == null ||
			type    == null
		) return sendError(res);
		userModel = model.user(name, age, country, phone, type);
		db.InsertOne(config.dbName, 'users', userModel, () => {
			sendSuccess(res);
		});
	}
}
function update(req, res) {
	parsePostData(req, updateData);

	function updateData(data) {
		let id = null,
			key = '',
			value = '',
			obj = {};
		data.forEach(item => {
			if (item[0] === 'id') id = item[1];
			if (item[0] === 'key') key = item[1];
			if (item[0] === 'value') value = item[1];
		});
		if (id == null || key === '' || value === '') return sendError(res);
		obj[key] = value;
		db.UpdateOne(config.dbName, 'users', {id}, {$set: obj}, () => {
			sendSuccess(res);
		});
	}
}
function deleteOne(req, res) {
	let data = ParseGetData(req.url),
		id = null;
	data.forEach(item => {
		if (item[0] === 'id') id = item[1];
	});
	if (id == null) return sendError(res);
	db.DeleteOne(config.dbName, 'users', {id}, () => {
		sendSuccess(res);
	});
}
function makeBackup(req, res) {
	db.SaveDB(config.dbName, path.join(__dirname, "/../" + config.backupPath), writeResult);
	
	function writeResult() {
		let file = new fs.createReadStream(path.join(__dirname, "/../" + config.backupPath));
		file.on('data', (data) => {
			res.write(data);
		});
		file.on('end', () => {
			res.end();
		});
	}
}
function parsePostData(req, cb) {
	req.on('data', parseData);
      
	function parseData(postData) {
		let data = postData.toString().split('&'),
			result = [];
		for (var i = 0; i < data.length; i++) {
			result[i] = data[i].split('=');            
		}
		cb(result);
	}
}
function ParseGetData(url) {
    let data = url.split('?')[1].split('&'),
        result = [];
    for (let i = 0; i < data.length; i++) {
        result[i] =  data[i].split('=');
    }
    return result;
}
function sendSuccess(res) {
	if (!res.finished) {
		res.statusCode = 200;
		res.end();
	}
}
function sendError(res, err = 'Server error!', code = 404) {
	if (!res.finished) {
		res.statusCode = code;
		res.statusMessage = err;
		res.end();
	}
}

module.exports = {
    find: find,
    insert: insert,
    update: update,
	deleteOne: deleteOne,
	makeBackup: makeBackup
};
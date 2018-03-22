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
		db.InsertOne(config.dbName, 'users', userModel, null);
	}
}
function update(req, res) {}
function deleteOne(req, res) {}
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
function sendError(res, err = 'Server error!', code = 404) {
	if (!res.finished) {
		res.statusCode = 403;
		res.statusMessage = err;
		res.end();
	}
}

module.exports = {
    find: find,
    insert: insert,
    update: update,
    deleteOne: deleteOne
};
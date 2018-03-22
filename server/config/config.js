module.exports = (() => {
    const fs   = require('fs'),
          path = require('path');
    let result = null;
    try {
        result = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json')));
    } catch(ex) {
        console.log(ex);
        // set default config
        result = {
            dbUrl: '',
            dbName: '',
            port: 3000
        };
    }
    return result;
})();
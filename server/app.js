const http = require('http');

const func   = require('./private/func'),
      config = require('./config/config');

let app = http.createServer((req, res) => {
    console.log(req.method + ' ' + req.url);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');

    if (req.url === '/find') func.find(req, res);
    else if (req.url === '/insert') func.insert(req, res);
    else if (req.url === '/update') func.update(req, res);
    else if (~req.url.indexOf('/deleteOne')) func.deleteOne(req, res);
    else if (req.url === '/getBackUp') func.makeBackup(req, res);
    else res.end('404');
});

app.listen(config.port, () => {
    console.log('Server start. Port - ' + config.port);
});
const http = require('http');

const func   = require('./private/func'),
      config = require('./config/config');

let app = http.createServer((req, res) => {
    console.log(req.method + ' ' + req.url);
    if (req.url === '/find') func.find(req, res);
    else if (req.url === '/insert') func.insert(req, res);
    else if (req.url === '/update') func.update(req, res);
    else if (req.url === '/deleteOne') func.deleteOne(req, res);
    else res.end('404');
});

app.listen(config.port, () => {
    console.log('Server start. Port - ' + config.port);
});
//uses techniques from
//https://forum.vuejs.org/t/how-do-i-implement-connect-history-api-fallback-so-that-url-paths-redirect-to-index-html/10938/2

import express from 'express';
import fs from 'fs';
import https from 'https';
import history from 'connect-history-api-fallback';
import cors from 'cors';

import service from './service.js';

const options = {
    cert: fs.readFileSync('./certs/fullchain.pem'),
    key: fs.readFileSync('./certs/privkey.pem')
};

const unsecurePort = 3000;
const sslPort = 8443;

const app = express();
app.use(express.json());
app.use(cors());


//Middleware for serving '/srv/pipetteshow' directory
const staticFileMiddleware = express.static('/srv/pipetteshow');

app.use(staticFileMiddleware);
app.use(history());

//2nd call for redirected requests
app.use(staticFileMiddleware);

app.get('/', function(req, res) {
  res.render('/srv/pipetteshow/index.html');
});

app.post('/service', async function(request, response) {  
	return service(request, response);	
});

https.createServer(options, app).listen(sslPort);
console.log(`PipetteShow-Server listening at http://localhost:${sslPort}`)

// Redirect for unsecure http:// protocol
var http = express();
http.get('*', function(req, res) {  
    res.redirect('https://' + req.headers.host + req.url);
});
http.listen(unsecurePort);
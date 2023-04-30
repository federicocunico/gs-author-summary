// const http = require('http')
// const fs = require('fs')

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'content-type': 'text/html' })
//   fs.createReadStream('index.html').pipe(res)
// })

// console.log("Server running on port 3000")
// server.listen(process.env.PORT || 3000)


import express from 'express';
import { join } from 'path';

const app = express();
const port = process.env.PORT || 3000;

// app.use(express.static(join(__dirname, './')));
app.use(express.static('./'));

// sendFile will go here
app.get('/', function(req, res) {
  // res.sendFile(join(__dirname, '/index.html'));
  res.sendFile('index.html');
});

app.listen(port);
console.log('Server started at http://localhost:' + port);

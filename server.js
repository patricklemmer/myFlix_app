//Shorthand to import Node modules http, fs and url
const http = require('http'),
  fs = require('fs'),
  url = require('url');

//Creates Server using "createServer" function
http.createServer((request, response) => {
  //New var "addr" is declared and assigned to the function "request.url"
  let addr = request.url,
    //New var "q" is declared and assigned to the "url.parse" function which is used on the new var "addr"
    q = url.parse(addr, true),
    //New var "filePath" is declared and assigned to an empty string
    filePath = '';

  //"appendFile" function adds the URL and timestamp to a log file whenever a request is done
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    //In case of an error, error msg gets printed to console
    if (err) {
      console.log(err);
      //Whenever a new line is added to log file, success msg gets printed to console
    } else {
      console.log('Added to log.');
    }
  });
  //if-else statement evaluates pathname of user request and returns respective file to the user
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }
  //Reads file path and returns error if file path contains an error
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });

  //Server listens to PORT 8080
}).listen(8080);

console.log('My first server...');
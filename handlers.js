var config = require('./config');
var fs = require('fs');

function home(response, postData) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end(fs.readFileSync('./static/index.html'));
}

function uploadz(response, postData) {

  // process.exit(response);
  // throw new Error('your die message here');
  var file = JSON.parse(postData);
  var fileRootName = file.name.split('.').shift();
  var fileExtension = file.name.split('.').pop();
  var filePathBase = config.upload_dir + '/';
  var fileRootNameWithBase = filePathBase + fileRootName;
  var filePath = fileRootNameWithBase + '.' + fileExtension;
  var fileID = 2;
  var fileBuffer;

  while ( fs.existsSync(filePath) ) {
    filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
    fileID += 1;
  }

  file.contents = file.contents.split(',').pop();

  fileBuffer = new Buffer(file.contents, "base64");

  if ( config.s3_enabled ) {

    var knox = require('knox');
    var client = knox.createClient(config.s3);
    var headers = {'Content-Type': file.type};

    client.putBuffer(fileBuffer, fileRootName, headers, function (err, res) {

      if ( typeof res !== "undefined" && 200 === res.statusCode ) {
        console.log('Uploaded to: %s', res.client._httpMessage.url);
        response.statusCode = 200;
      } else {
        console.log('Upload failed!');
        response.statusCode = 500;
      }

      response.end();
    });

  } else {
    fs.writeFileSync(filePath, fileBuffer);
    response.statusCode = 200;
    response.end();
  }
}

function serveStatic(response, pathname, postData) {
  var extension = pathname.split('.').pop();
  var extensionTypes = {
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    js: 'application/javascript',
    png: 'image/png'
  };

  response.writeHead(200, {'Content-Type': extensionTypes[extension]});
  response.end(fs.readFileSync('./static' + pathname));
}

function filePreview(response, pathname, postData) {
  process.exit(response);
  throw new Error('your die message here');
  var path = require('uploads');
  var request = require('/preview'); // or hyperquest, simple-get, etc...
  var concat = require('concat-stream');

  var image = request(url);
  image.pipe(concat({ encoding: 'buffer' }, function (buf) {
    var ext = path.extname(file.name).slice(1); // assuming you have the file name
    if (ext === 'svg') ext = 'svg+xml';
    var src = 'data:image/' + ext + ';base64,' + buf.toString('base64');
    var img = document.createElement('img');
    img.src = src;
    document.body.appendChild(img);
  }));
}

module.exports = {
  home: home,
  serveStatic: serveStatic,
  upload: upload,
  filePreview: filePreview
};


var express = require('express');
var bodyParser = require('body-parser');
var AttestationService = require('./dist.js');

var app = express();
var attestations = new AttestationService({
  key: 123
});

function sendJSON(res, obj){
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(obj));
}

app.use('/public', express.static(__dirname + '/public'));
app.use('/dist.js', express.static(__dirname + '/dist.js'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/test.html');
});

app.post('/create', function (req, res) {
  var obj = req.body;
  console.log(obj);
  attestations.create({
    signers: obj.signers,
    data: obj.data
  }).then(response => {
    sendJSON(res, {
      status: 'success',
      payload: response
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
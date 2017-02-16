
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var AttestationService = require('../index.js');

var attestations = new AttestationService({
  key: 123
});

function sendJSON(res, obj){
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(obj));
}

console.log(attestations);
// express.static(__dirname + '/views')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html');
});


app.post('/create', function (req, res) {
  var obj = req.body;
  console.log(obj);
  attestations.create({
    ids: obj.ids,
    data: obj.data
  }).then(response => {
    sendJSON(res, {
      status: 'success'
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
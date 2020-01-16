var express = require('express');
var axios = require('axios');
var app = express();

var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

var port = process.env.PORT || 3000;

var config = {
    headers: {'Access-Control-Allow-Origin': '*'}
};

app.use(requestTime);

app.get('/api', function (req, res) {
    const pair = req.query.pair || 'xbteur';
  axios.get(`https://api.kraken.com/0/public/Depth?pair=${pair}&count=4`, config).then((response) => {
    const pair = Object.keys(response.data.result)[0];
    const result = response.data.result;
    const { asks, bids } = result[pair];
    const jsonResponse = Object.assign({}, { pair, asks, bids });
    res.json(jsonResponse);
  }).catch((err) => {
      res.send(err);
  });
});

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.js');
})


app.listen(port);
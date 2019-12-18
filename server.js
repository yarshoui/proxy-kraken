var express = require('express');
var axios = require('axios');
var app = express();

var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

var config = {
    headers: {'Access-Control-Allow-Origin': '*'}
};

app.use(requestTime);

app.get('/', function (req, res) {
    const pair = req.query.pair || 'xbtusd';
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

app.listen(3000);
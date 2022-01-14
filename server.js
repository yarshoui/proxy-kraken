var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function filterArray(array) {
	const byQty = value => value[1] > 1;
	const byPrice = value => value[0] > 9285.1;

	return array.filter(byQty).filter(byPrice);
}

app.get('/api', function (req, res) {
    const pair = req.query.pair || 'xbteur';
  axios.get(`https://api.kraken.com/0/public/Depth?pair=${pair}&count=25`, config).then((response) => {
    const pair = Object.keys(response.data.result)[0];
    const result = response.data.result;
    const { asks, bids } = result[pair];
    const jsonResponse = Object.assign({}, { pair, filterArray(asks), filterArray(bids) });
    return res.status(200).json(jsonResponse);
  }).catch((err) => {
      res.send(err);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.use(express.static(__dirname));
app.listen(port);

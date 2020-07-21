window.onload = () => {

    const apiUrl = 'https://proxy-kraken.herokuapp.com/api';
   /* const timeUpdateInput = document.getElementById('timeupdate');
    const timeUpdate = (timeUpdateInput.value)*1000;*/

    
    function prepareTableView(asks, bids) {
        
        const tableAskBody = document.querySelector('.ask tbody');
        const tableBidBody = document.querySelector('.bid tbody');

        const askFragment = document.createDocumentFragment();
        const bidFragment = document.createDocumentFragment();
    
        for (let i=0; i<asks.length; i++){
            const tr = document.createElement('tr');
    
            for (let j=0; j<asks[i].length; j++) {
                const td = document.createElement('td');
                td.textContent = asks[i][j];
                tr.append(td);
            }
            askFragment.append(tr);
        }
    
        for (let i=0; i<bids.length; i++){
            const tr = document.createElement('tr');
    
            for (let j=0; j<bids[i].length; j++) {
                const td = document.createElement('td');
                td.textContent = bids[i][j];
                tr.append(td);
            }
            bidFragment.append(tr);
        }
        tableAskBody.innerHTML = '';
        tableAskBody.appendChild(askFragment);
        tableBidBody.innerHTML = '';
        tableBidBody.appendChild(bidFragment);
    }
    const interval = setInterval(() => {
       getData();
    }, 5000);


let sub = {
  "event": "subscribe",
  "pair": [
    "XBT/EUR"
  ],
  "subscription": {
//       "interval":100,
"depth": 1000,
    "name": "book"
  }}
  
function getData() {
  let ws = new WebSocket('wss://ws.kraken.com');
  ws.onopen = function() {
    console.log("[open] Connection established 1");
    ws.send(JSON.stringify(sub))
  }
  ws.onerror = function(error) {
    console.log(`[error] ${error.message}`);
  }
  ;
  let count = 3
  let newData = []
  ws.onmessage = function(msg) {
    newData.push(JSON.parse(msg.data))
    count--;

    if (count === 0) {
      ws.close();

      let orderBookAsk = newData[2][1].as.filter(v => v[1] >= 5).slice(0,25);
      let orderBookBid = newData[2][1].bs.filter(v => v[1] >= 5).slice(0,25);

      prepareTableView(orderBookAsk, orderBookBid)
    }
  }

  ws.onclose = function(event) {
    console.log("WebSocket is closed now.");
  };
}

getData();

}
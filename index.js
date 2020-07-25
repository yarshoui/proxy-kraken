window.onload = () => {
// const newData = [];
    const apiUrl = 'https://proxy-kraken.herokuapp.com/api';
   /* const timeUpdateInput = document.getElementById('timeupdate');
    const timeUpdate = (timeUpdateInput.value)*1000;*/
    let qtyFilterInput = document.getElementById('qtyfilter');
    const pairFilterInput = document.getElementById('pairfilter');
    

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


const getSub = () => {
  console.log(pairFilterInput.value);
  return {
    "event": "subscribe",
    "pair": [
      pairFilterInput.value
     //pairFilterInput
    ],
    "subscription": {
  //       "interval":100,
  "depth": 1000,
      "name": "book"
    }} 
}
 
  
  qtyFilterInput.addEventListener('onkeydown', (evt) => {
    console.log(evt);
  })
function getData() {
  let ws = new WebSocket('wss://ws.kraken.com');
  ws.onopen = function() {
    console.log("[open] Connection established 1");
    ws.send(JSON.stringify(getSub()))
  }
  ws.onerror = function(error) {
    console.log(`[error] ${error.message}`);
  }
  ;
  let count = 3
  let newData = []

  
let logCounter=2;

  ws.onmessage = function(msg) {

    // console.log('msg', msg);
    newData.push(JSON.parse(msg.data))
    // console.log('newdata', newData);
    count--;

    if (count === 0) {
      ws.close();

      let orderBookAsk = newData[2][1].as.filter(v => parseFloat(v[1]) >= parseFloat(qtyFilterInput.value)).slice(0,25);
      let orderBookBid = newData[2][1].bs.filter(v => parseFloat(v[1]) >= parseFloat(qtyFilterInput.value)).slice(0,25);
      // console.log(' newData[2][1]',  newData[2][1]);
      // console.log('orderBookAsk', orderBookAsk);

      // debugger;

      prepareTableView(orderBookAsk, orderBookBid)
    }
  }

  ws.onclose = function(event) {
    console.log("WebSocket is closed now.");
  };
}

getData();

}
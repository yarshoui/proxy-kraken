const data = {
  as: [],
  bs: [],
};
let ws;
let timeOfClose = 0;

let qtyFilterInput;
let pairFilterInput;

let tableAskBody;
let tableBidBody;
<<<<<<< Updated upstream

const subscribeToCurrencyPair = () => {
        // console.log(pairFilterInput.value);

        const payload = {
            event: 'subscribe',
            pair: [
                pairFilterInput.value,
            ],
            subscription: {
                // interval: 100,
                depth: 1000,
                name: 'book',
            }
        };

        // console.log(payload);
        return JSON.stringify(payload);
    };
=======

let tableTradeBody;

const subscribeToCurrencyPair = ()=>{
  // console.log(pairFilterInput.value);

  const payload = {
    event: 'subscribe',
    pair: [pairFilterInput.value, ],
    subscription: {
      depth: 1000,
      name: 'book',
    }
  };

  // console.log(payload);
  return JSON.stringify(payload);
}

const subscribeToTradeTable = ()=>{
  // console.log(pairFilterInput.value);

  const payload = {
    event: 'subscribe',
    pair: [pairFilterInput.value, ],
    subscription: {
      name: 'trade',
    }
  };

  console.log(payload);
  return JSON.stringify(payload);
}
>>>>>>> Stashed changes

function resetData(data) {
    data.as = [];
    data.bs = [];
}

<<<<<<< Updated upstream
function sendSubscription() {
    ws.send(subscribeToCurrencyPair())
=======
function populateTradeTable(msg) {
  const newDataTrade = JSON.parse(msg.data);
  if (newDataTrade.channelID || newDataTrade.connectionID || !Array.isArray(newDataTrade) || newDataTrade.length < 2 || !newDataTrade[1]) {
    return;
  }
  console.log(dataTrade);


  if (Array.isArray(newDataTrade[1]))
    dataTrade.trade = newDataTrade[1];
  // todo parse data from soket assigne to dataTrade
}

function populateOrderTable(msg) {
  const newData = JSON.parse(msg.data);

  if (newData.channelID || newData.connectionID || !Array.isArray(newData) || newData.length < 2 || !newData[1]) {
    return;
  }

  // bid update
  if (newData[1].b) {
    // if bid is 0 - find and remove from initial data
    // data.bs = [ ...data.bs, ...newData[1].b ];
    return;
  }

  // ask update
  if (newData[1].a) {
    // if ask is 0 - find and remove from initial data
    // data.as = [ ...data.as, ...newData[1].a ];
    return;
  }

  // something which is not valid for us
  if (!newData[1].as || !newData[1].bs) {
    return;
  }

  resetData(data);

  console.count('onmessage');
  console.log(newData[1]);
  // update initial ask/bid array(1000 elements)
  data.as = newData[1].as;
  data.bs = newData[1].bs;
>>>>>>> Stashed changes
}

function prepareSocket() {
    ws = new WebSocket('wss://ws.kraken.com');

    ws.onclose = (data) => {
        // todo reset if failed 5 times in 30-60second
        // timeOfClose = timeOfClose === 0 ? Date.now() timeOfClose
        // if timeOfClose - Date.now() > 60000 alert()

        prepareSocket();
        console.log('WebSocket is closed now.', data);
    };

    ws.onopen = () => {
        console.log('[open] Connection established 1');
        setInterval(sendSubscription, 3000);  
        ws.send(subscribeToCurrencyPair());
    };

    ws.onerror = (error) => {
        console.log(`[error] ${error.message}`);
    };

    ws.onmessage = function(msg) {
      const newData = JSON.parse(msg.data);

      if (newData.channelID || newData.connectionID || !Array.isArray(newData)
        || newData.length < 2 || !newData[1]
      ) {
          return;
      }

// bid update
      if (newData[1].b) {
          // if bid is 0 - find and remove from initial data
          // data.bs = [ ...data.bs, ...newData[1].b ];
          return;
      }

      // ask update
      if (newData[1].a) {
          // if ask is 0 - find and remove from initial data
          // data.as = [ ...data.as, ...newData[1].a ];
          return;
      }

      // something which is not valid for us
      if (!newData[1].as || !newData[1].bs) {
          return;
      }

      resetData(data);

      console.count('onmessage');
      console.log(newData[1]);
      // update initial ask/bid array(1000 elements)
      data.as = newData[1].as;
      data.bs = newData[1].bs;
    };
}

window.onload = () => {
    // const apiUrl = 'https://proxy-kraken.herokuapp.com/api';

    /* const timeUpdateInput = document.getElementById('timeupdate');
    const timeUpdate = (timeUpdateInput.value)*1000;*/
    qtyFilterInput = document.getElementById('qtyfilter');
    pairFilterInput = document.getElementById('pairfilter');
    tableAskBody = document.querySelector('.ask tbody');
    tableBidBody = document.querySelector('.bid tbody');

    // send signal to socket to change pair
    pairFilterInput.addEventListener('change', (evt) => {
        console.log(evt.srcElement.value);
        sendSubscription();
        // clear cached data
//         resetData(data);
    });

// if we want to update data after qty change
//     qtyFilterInput.addEventListener('change', (evt) => {
//         console.log(evt.srcElement.value);
//         sendSubscription();
//         // clear cached data
//         //  resetData(data);
//     });

    /**
     * @description replace table data in ask and bid tables
     * @param { price, quantity, timestamp } asks
     * @param { price, quantity, timestamp } bids
     */
<<<<<<< Updated upstream
    const prepareTableView = (asks, bids) => {
        const askFragment = document.createDocumentFragment();
        const bidFragment = document.createDocumentFragment();
    
        for (let i = 0; i < asks.length; i++) {
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
    };

    setInterval(() => {
      const orderBookAsk = data.as.filter(v => parseFloat(v[1]) >= parseFloat(qtyFilterInput.value)).slice(0,30);
      const orderBookBid = data.bs.filter(v => parseFloat(v[1]) >= parseFloat(qtyFilterInput.value)).slice(0,30);
      // console.log('orderBookAsk', orderBookAsk);
      // console.log('orderBookBid', orderBookBid);
      // console.log(data);

      prepareTableView(orderBookAsk, orderBookBid);
    }, 5000);

    /**
=======

  /**
  * @description replace trade table data in trades table
  * @param { price, quantity, timestamp, side, ordertype, misc } trades
  */

  const prepareTradeTableView = ({ trade })=>{
    const tradeFragment = document.createDocumentFragment();
    for (let i = 0; i < trade.length; i++) {
      const tr = document.createElement('tr');

      for (let j = 0; j < trade[i].length; j++) {
        const td = document.createElement('td');
        td.textContent = trade[i][j];
        tr.append(td);
      }

      tradeFragment.append(tr);
    }
    const children = tableTradeBody.querySelectorAll('tr');
    //const rest = Array.from(children).slice(0,100);
    //tradeFragment.append(rest);
    for (let s=0; s<children.length; s++ ){
      if(s>10){
        return
      }
      tradeFragment.append(children[s]);
    } 
    tableTradeBody.innerHTML = '';
    tableTradeBody.appendChild(tradeFragment);
  //---------------------------------------------------
  //  adding new trades to the top of the table
  //    tableTradeBody.prepend(tradeFragment);


  }

  const prepareTableView = (asks,bids)=>{
    const askFragment = document.createDocumentFragment();
    const bidFragment = document.createDocumentFragment();

    for (let i = 0; i < asks.length; i++) {
      const tr = document.createElement('tr');

      for (let j = 0; j < asks[i].length; j++) {
        const td = document.createElement('td');
        td.textContent = asks[i][j];
        tr.append(td);
      }

      askFragment.append(tr);
    }

    for (let i = 0; i < bids.length; i++) {
      const tr = document.createElement('tr');

      for (let j = 0; j < bids[i].length; j++) {
        const td = document.createElement('td');
        td.textContent = bids[i][j];
        tr.append(td);
      }

      bidFragment.append(tr);
    }

 //   tableAskBody.innerHTML = '';
 //   tableAskBody.appendChild(askFragment);

  //  tableBidBody.innerHTML = '';
  //  tableBidBody.appendChild(bidFragment);
  }

  setInterval(()=>{
    const orderBookAsk = data.as.filter(v=>parseFloat(v[1]) >= parseFloat(qtyFilterInput.value)).slice(0, 30);
    const orderBookBid = data.bs.filter(v=>parseFloat(v[1]) >= parseFloat(qtyFilterInput.value)).slice(0, 30);
    // console.log('orderBookAsk', orderBookAsk);
    // console.log('orderBookBid', orderBookBid);
    // console.log(data);

    prepareTableView(orderBookAsk, orderBookBid);

    //todo filter data
    prepareTradeTableView(dataTrade);
  }
  , 3000);

  /**
>>>>>>> Stashed changes
     * @description data for socket, to subscribe to some pair
     * @axample pair: XBT/USD
     */
    prepareSocket();
/// todo: prepare socket
};

window.onload = () => {
    const data = {
      as: [],
      bs: [],
    };
    // const apiUrl = 'https://proxy-kraken.herokuapp.com/api';
    const ws = new WebSocket('wss://ws.kraken.com');
    /* const timeUpdateInput = document.getElementById('timeupdate');
    const timeUpdate = (timeUpdateInput.value)*1000;*/
    const qtyFilterInput = document.getElementById('qtyfilter');
    const pairFilterInput = document.getElementById('pairfilter');
    const tableAskBody = document.querySelector('.ask tbody');
    const tableBidBody = document.querySelector('.bid tbody');

    // send signal to socket to change pair
    pairFilterInput.addEventListener('change', (evt) => {
        console.log(evt.srcElement.value);
        ws.send(subscribeToCurrencyPair());
        // clear cached data
        data.as = [];
        data.bs = [];
    });

    /**
     * @description replace table data in ask and bid tables
     * @param { price, quantity, timestamp } asks
     * @param { price, quantity, timestamp } bids
     */
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
     * @description data for socket, to subscribe to some pair
     * @axample pair: XBT/USD
     */
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

    // const interval = setInterval(() => {
    //    getData();
    // }, 3000);
    ws.onclose = (data) => {
        console.log('WebSocket is closed now.', data);
    };

    ws.onopen = () => {
        console.log('[open] Connection established 1');
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

      console.log(newData[1]);
      // update initial ask/bid array(1000 elements)
      data.as = [ ...data.as, ...newData[1].as ];
      data.bs = [ ...data.bs, ...newData[1].bs ];
    };
};

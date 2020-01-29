window.onload = () => {
    const pairString = 'xbteur';
    const apiUrl = 'https://proxy-kraken.herokuapp.com/api';

    function prepareTableView(response) {
        const {asks, bids} = response;
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
    
        tableAskBody.innerHTML = askFragment;
        tableBidBody.innerHTML = bidFragment;
        console.log(askFragment);
        console.log(bidFragment);
    }
    const interval = setInterval(() => {
        fetch(apiUrl, {
            mode: 'no-cors',        
        }).then((data) => {
            return data.json();
        }).then((data) => {
            prepareTableView(data);
        });
    }, 5000);

}
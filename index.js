window.onload = () => {
    const pairString = 'xbteur';
    const apiUrl = 'https://proxy-kraken.herokuapp.com/api';

    function prepareTableView(response) {
        const {asks, bids} = response.result;
        const tableAsk = document.querySelector('.ask');
        const tableBid = document.querySelector('.bid');
        
        tableAsk.innerHTML = '';
        tableBid.innerHTML = '';

        for (let i=0; i<asks.length; i++){
            const tr = document.createElement('tr');

            for (let j=0; j<asks[i].length; j++) {
                const td = document.createElement('td');
                td.textContent = asks[i][j];
                tr.append(td);
            }
            tableAsk.append(tr);
            console.log(tableAsk);
        }

        for (let i=0; i<bids.length; i++){
            const tr = document.createElement('tr');

            for (let j=0; j<bids[i].length; j++) {
                const td = document.createElement('td');
                td.textContent = bids[i][j];
                tr.append(td);
            }

            tableBid.append(tr);
            console.log(tableBid);
        }

    }
    fetch(apiUrl, {
        mode: 'no-cors',        
    }).then((data)=>{
        prepareTableView(data);
    }, 5000);
}
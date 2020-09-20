function main() {
    // Modify element
    var eth_ratio = document.getElementById("eth_ratio");
    var eth_tx = document.getElementById(("eth_tx"));
    var eth_gas = document.getElementById("eth_gas");
    var bnb_ratio = document.getElementById(("bnb_ratio"));
    var bsc_tx = document.getElementById(("bsc_tx"));
    var eth_filled_tx = document.getElementById(("eth_filled_tx"));

    // URL
    var coingecko_bot_price = "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0x5beabaebb3146685dd74176f68a0721f91297d37&vs_currencies=eth%2Cbnb";
    var etherscan_gas_price = "https://api.etherscan.io/api?module=gastracker&action=gasoracle";
    var server_get_count = "http://39.96.184.126:13247/api/count/0"

    // Global var
    var eth_ratio_result;

    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request_for_ratio = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    request_for_ratio.open('GET', coingecko_bot_price);

    request_for_ratio.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response)

        let bnb_ratio_result;
        let bnb_tx_result;
        if (request_for_ratio.status >= 200 && request_for_ratio.status < 400) {
            eth_ratio_result = parseFloat(data["0x5beabaebb3146685dd74176f68a0721f91297d37"]["eth"]);
            bnb_ratio_result = parseFloat(data["0x5beabaebb3146685dd74176f68a0721f91297d37"]["bnb"]);
            bnb_tx_result = 15.36 * bnb_ratio_result * 8;
            eth_ratio.innerText = eth_ratio_result + " ETH";
            bnb_ratio.innerText = bnb_ratio_result + " BNB";
            bsc_tx.innerText = Math.floor(bnb_tx_result) + " Transactions";

        } else {
            console.log('error')
        }
    }

    // Send request
    request_for_ratio.send()

    var request_for_gas = new XMLHttpRequest();
    request_for_gas.open("GET", etherscan_gas_price);

    request_for_gas.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response)

        let eth_gas_result;
        let eth_tx_result;
        if (request_for_gas.status >= 200 && request_for_gas.status < 400) {
            eth_gas_result = parseFloat(data["result"]["SafeGasPrice"]);
            eth_tx_result = (35.84 * eth_ratio_result) / ((eth_gas_result * 150000 * 10**9 + 0.0075 * 10**18) / 10**18)
                eth_gas.innerText = "with " + eth_gas_result + " gwei gas price";
            eth_tx.innerText = Math.floor(eth_tx_result) + " Transactions";
        } else {
            console.log('error')
        }
    }

    request_for_gas.send();

    var request_for_count = new XMLHttpRequest();
    request_for_count.open("GET", server_get_count);

    request_for_count.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response)

        let eth_count_result;
        if (request_for_count.status >= 200 && request_for_count.status < 400) {
            eth_count_result = parseInt(data["count"]);
            eth_filled_tx.innerText = "Including " + eth_count_result + " Filled";
        } else {
            console.log('error')
        }
    }

    request_for_count.send();
}


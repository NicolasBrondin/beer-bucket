if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) {
    // is IE11
    document.getElementById('ie').style.display = 'block';
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


var count = 1;
function add_coin(){
    if(count < 5){
        count++;
        var coin = document.createElement('button');
        coin.classList =  "coin";
        document.getElementById('coins').insertBefore(coin, document.getElementById('plus'));
        document.getElementById('beercoin_count').innerHTML = count;
    }
}

function remove_coin(){
    if(count > 1){
        count--;
        document.getElementById('coins').removeChild(document.querySelector('#send .coin'));
        document.getElementById('beercoin_count').innerHTML = count;
    }
}

function show_form(){
    document.getElementById('validation').style.display = 'none';
    document.getElementById('validated').style.display = 'none';
    document.getElementById('send').style.display = 'block';
    var send_button = document.getElementById('send-button').innerHTML = 'Send';
    var email_from = document.getElementById('email-from').value = "";
    var email_to = document.getElementById('email-to').value = "";
    window.location.hash='send';
}

function show_success(){
    
    document.getElementById('send').style.display = 'none';
    document.getElementById('validation').style.display = 'block';
    window.location.hash='validation';
}

function show_wallet(){
    
    document.getElementById('wallet').style.display = 'block';
    document.getElementById('wallet-separator').style.display = 'block';
    window.location.hash='wallet';
}

function show_validated(){
    
    document.getElementById('send').style.display = 'none';
    document.getElementById('validation').style.display = 'none';
    document.getElementById('validated').style.display = 'block';
    window.location.hash='validated';
}

function send_beercoins(){
    var send_button = document.getElementById('send-button');
    var email_from = document.getElementById('email-from').value;
    var email_to = document.getElementById('email-to').value;
    var send_error = document.getElementById('send-error');
    if(email_to && email_from){
        send_button.innerHTML='Sending...';
        var data = {
            email_from: email_from,
            email_to: email_to,
            beercoins: count
        };
        
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
          if(request.readyState === 4) {
            if(request.status === 200) { 
                JSON.parse(request.responseText);
                send_button.innerHTML='Sent!';
                send_error.innerHTML='';
                show_success();
            } else {
              console.error('An error occurred during your request: ', request.status + ' ' + request.statusText);
                send_error.innerHTML = 'Server error, try again...';
            } 
          }
        }
    
    request.open('Post', 'https://beer-bucket-api.herokuapp.com/transactions', true);
    //request.open('Post', 'http://localhost:3000/transactions', true);
    //request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(data));
        
    } else {
        send_error.innerHTML = 'Two email addresses must be filled!';
    }
}

function get_wallet(){
    show_wallet();
    var wallet_token = getURLParameter('wallet');
    if(wallet_token){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
          if(request.readyState === 4) {
            if(request.status === 200) { 
                console.log(request.response);
                var data = JSON.parse(request.response);
                console.log(data);
                document.getElementById('wallet-sum').innerHTML = data.transactions.reduce(function(s,t){
                    s += t.count;
                    var p = document.createElement('p');
                    p.innerHTML = t.count+" received from "+t.email_from;
                    var p2 = document.createElement('ul');
                    p2.innerHTML = t.beercoins.reduce(function(ss,b){
                        ss += "<li> "+b+" </li>";
                        return ss; 
                    },"");
                    document.getElementById('transaction-list').appendChild(p);
                    document.getElementById('transaction-list').appendChild(p2);
                    return s;
                },0);
            } else {
                console.error('An error occurred during your request: ', request.status + ' ' + request.statusText);
                wallet_error.innerHTML = 'Server error, try again...';
            } 
          }
        }
    request.open('Get', 'https://beer-bucket-api.herokuapp.com/users?wallet='+wallet_token, true);
    //request.open('Post', 'http://localhost:3000/transactions', true);
    //request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send();
        
    } else {
        wallet_error.innerHTML = 'Wallet not found !';
    }
}

if(window.location.href.indexOf('token') > -1){
    show_validated();
} else if(window.location.href.indexOf('wallet') > -1) {
    get_wallet();
}

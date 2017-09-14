if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) {
    // is IE11
    document.getElementById('ie').style.display = 'block';
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
            } else {
              console.error('An error occurred during your request: ', request.status + ' ' + request.statusText);
                send_error.innerHTML = 'Server error, try again...';
            } 
          }
        }
    
    request.open('Post', 'https://beer-bucket-api.herokuapp.com/beercoins', true);
    //request.open('Post', 'http://localhost:3000/beercoins', true);
    //request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(data));
        
    } else {
        send_error.innerHTML = 'Two email addresses must be filled!';
    }
}

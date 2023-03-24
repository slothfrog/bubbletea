export let paymentApi = (function(){
    
    function send(method, url, data, callback){
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, xhr.responseText);
        };
        const baseURL = process.env.REACT_APP_SERVER_URL+"/rest/payment"
        xhr.open(method, baseURL+url, true);
        xhr.withCredentials = true;
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }
    
    let module = {};
    
    module.pay = function(orderId, paymentMethod, locationId, readyDate, callback=()=>{}){
        send("POST", "/pay", {orderId, paymentMethod, locationId, readyDate}, callback);
    }
    module.paypalSuccess = function(orderId, queryParam, callback=()=>{}){
        send("POST", "/paypal/success", {orderId, ...queryParam}, callback);
    }
    module.paypalCalcel = function(orderId, queryParam, callback=()=>{}){
        send("POST", "/paypal/calcel", {orderId, ...queryParam}, callback);
    }
    
    return module;
})();
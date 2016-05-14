// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var app = require("application");
var androidApp = app.android;
var androidAppCtx = androidApp.context;


var activity;
var callback;
var loggers = [];
var reqCode;


var actionRunnable = java.lang.Runnable.extend({
    action: null,

    run: function() {
        if (this.action) {
            this.action();
        }
    }    
});


// addLogger
function addLogger(l) {
    loggers.push(l);
}
exports.addLogger = addLogger;

// logMsg()
function logMsg(msg) {
    for (var i = 0; i < loggers.length; i++) {
        try {
            var l = loggers[i];
            if (l) {
                l(msg);
            }
        }
        catch (e) {
            // ignore
        }
    }
}

// init()
function init(cfg) {
    activity = androidApp.foregroundActivity || androidApp.startActivity;
    if (!activity) {
        return;
    }
    
    if (!cfg) {
        cfg = {};
    }
    
    reqCode = 198612227;
    
    activity.onActivityResult = function(requestCode, resultCode, intent) {
        var resultCtx = {};
        var cb = callback;
        
        try {
            if (requestCode == reqCode) {
                if (resultCode == android.app.Activity.RESULT_OK) {
                    var resp = new mp.PaymentResponse(intent);
                    switch (resp.getBillingStatus()) {
                        case mp.MpUtils.MESSAGE_STATUS_BILLED:
                            resultCtx.code = 0;
                            
                            var extras = intent.getExtras();
                            
                            resultCtx.credit = {
                                amount: extras.getString("credit_amount"),
                                name: extras.getString("credit_name"),
                            };
                            
                            resultCtx.message = {
                                id: extras.getString("message_id")
                            };
                            
                            resultCtx.price = {
                                amount: extras.getString("price_amount"),
                                currency: extras.getString("price_currency")
                            };
                            
                            resultCtx.payment = {
                                code: extras.getString("payment_code")
                            };
                            
                            resultCtx.product = {
                                name: extras.getString("product_name")
                            };
                            
                            resultCtx.billing = {
                                status: extras.getString("billing_status")
                            };
                            
                            resultCtx.user = {
                                id: extras.getString("user_id")
                            };
                            
                            resultCtx.service = {
                                id: extras.getString("service_id")
                            };
                            break;
                            
                        case mp.MpUtils.MESSAGE_STATUS_FAILED:
                            resultCtx.code = 2;
                            break;
                            
                        case mp.MpUtils.MESSAGE_STATUS_PENDING:
                            resultCtx.code = 3;
                            break;
                    }
                }
                else if (resultCode == android.app.Activity.RESULT_CANCELED) {
                    resultCtx.code = 1;
                }
            }
            else {
                if (cfg.onActivityResult) {
                    cfg.onActivityResult(requestCode, resultCode, intent);
                }
                
                cb = null;
            }
        }
        catch (e) {
            resultCtx.code = -1;
            resultCtx.message = e;
        }

        if (cb) {
            logMsg('onActivityResult >> result: ' + JSON.stringify(resultCtx));
            
            cb(resultCtx);
        }
    };
}
exports.init = init;

// newPurchase()
function newPurchase() {
    var p = {};

    // product id
    var id;
    p.getId = function() {
        return id;    
    };
    p.setId = function(newId) {
        id = newId;
        return this;
    };
    
    // product name
    var name;
    p.getName = function() {
        return name;    
    };
    p.setName = function(newName) {
        name = newName;
        return this;
    };
    
    // app secret
    var secret;
    p.getSecret = function() {
        return secret;    
    };
    p.setSecret = function(newSecret) {
        secret = newSecret;
        return this;
    };
    
    // display name
    var displayName;
    p.getDisplayName = function() {
        return displayName;    
    };
    p.setDisplayName = function(newDisplayName) {
        displayName = newDisplayName;
        return this;
    };
    
    // display name
    var amount;
    p.getAmount = function() {
        return amount;    
    };
    p.setAmount = function(newAmount) {
        amount = newAmount;
        return this;
    };
    
    var currency = 'USD';
    p.getCurrency = function() {
        return currency;    
    };
    p.setCurrency = function(newCurrency) {
        currency = newCurrency;
        return this;
    };
    
    var r = new actionRunnable();
    r.action = function() {
        var builder = new mp.PaymentRequest.PaymentRequestBuilder();
        
        logMsg('newPurchase >> id: ' + id);
        builder.setService(id, secret);
        
        if (name) {
            logMsg('newPurchase >> name: ' + name);
            builder.setProductName(name);
        }
        
        if (displayName) {
            logMsg('newPurchase >> displayname: ' + displayName);
            builder.setDisplayString(displayName);
        }
        
        logMsg('newPurchase >> amount: ' + amount);
        builder.setPriceAmount(amount);
        
        logMsg('newPurchase >> currency: ' + currency);
        builder.setPriceCurrency(currency);
        
        var req = builder.build();
        
        logMsg('newPurchase >> starting activity...');
        
        var reqIntent = req.toIntent(activity);
        activity.startActivityForResult(reqIntent, reqCode);
        
        logMsg('newPurchase >> activity started');
    };
    
    // start()
    p.start = function() {
        activity.runOnUiThread(r);
    };
    
    return p;
}
exports.newPurchase = newPurchase;
var Observable = require("data/observable").Observable;
var FortumoSMS = require('nativescript-fortumo-sms');

function createViewModel() {
    var viewModel = new Observable();

    viewModel.init = function() {
        FortumoSMS.addLogger(function(msg) {
            console.log('[nativescript-fortumo-sms]: ' + e);        
        });
        
        try {
            FortumoSMS.init();
        }
        catch (e) {
            console.log('[ERROR] VM: init: ' + e);
        }
    };

    viewModel.test = function() {
        try {
            var p = FortumoSMS.newPurchase()
                .setId('a3e92d08f7fa470725d88425db904441')
                .setName('test product')
                .setSecret('773d2f4e7af846972ba9192043366249')
                .setDisplayName('A test product')
                .setAmount('1.95');
                
            p.start();
        }
        catch (e) {
            console.log('[ERROR] VM: test: ' + e);
        }
    };

    return viewModel;
}

exports.createViewModel = createViewModel;
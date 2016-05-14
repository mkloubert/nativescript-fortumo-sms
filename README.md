[![npm](https://img.shields.io/npm/v/nativescript-fortumo-sms.svg)](https://www.npmjs.com/package/nativescript-fortumo-sms)
[![npm](https://img.shields.io/npm/dt/nativescript-fortumo-sms.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-fortumo-sms)

# NativeScript fortumo SMS

A [NativeScript](https://nativescript.org/) module providing access to [Fortumo SMS Gateway](https://fortumo.com/).

## License

[MIT license](https://raw.githubusercontent.com/mkloubert/nativescript-fortumo-sms/master/LICENSE)

## Platforms

* Android

## Installation

Run

```bash
tns plugin add nativescript-fortumo-sms
```

inside your app project to install the module.

### Android

#### AndroidManifest.xml

Keep sure to define the following permissions, activities and other data in your manifest file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Open Stores -->
    <uses-permission android:name="org.onepf.openiab.permission.BILLING" />
    <!-- Google -->
    <uses-permission android:name="com.android.vending.BILLING" />
    <!-- Nokia -->
    <uses-permission android:name="com.nokia.payment.BILLING" />
    <!-- Samsung -->
    <uses-permission android:name="com.sec.android.iap.permission.BILLING" />
    <!-- Fortumo -->
    <uses-feature android:name="android.hardware.telephony"
                  android:required="false" />
    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    <uses-permission android:name="android.permission.SEND_SMS" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <!-- SlideME -->
    <uses-permission android:name="com.slideme.sam.manager.inapp.permission.BILLING" />
    <!-- Skubit -->
    <uses-permission android:name="com.skubit.BILLING" />

    <application>
        <!-- Amazon -->
        <receiver android:name="com.amazon.device.iap.ResponseReceiver">
            <intent-filter>
                <action android:name="com.amazon.inapp.purchasing.NOTIFY"
                        android:permission="com.amazon.inapp.purchasing.Permission.NOTIFY" />
            </intent-filter>
        </receiver>
        <!-- Amazon -->

        <!-- Fortumo -->
        <receiver android:name="mp.MpSMSReceiver">
            <intent-filter>
                <action android:name="android.provider.Telephony.SMS_RECEIVED" />
            </intent-filter>
        </receiver>

        <service android:name="mp.MpService" />
        <service android:name="mp.StatusUpdateService" />

        <activity android:name="mp.MpActivity"
                  android:configChanges="orientation|keyboardHidden|screenSize"
                  android:theme="@android:style/Theme.Translucent.NoTitleBar" />
        <!-- Fortumo -->
    </application>
    
</manifest>
```

## Demo

For quick start have a look at the [demo/app/main-view-model.js](https://github.com/mkloubert/nativescript-fortumo-sms/blob/master/demo/app/main-view-model.js) file of the [demo app](https://github.com/mkloubert/nativescript-fortumo-sms/tree/master/demo) to learn how it works.

Otherwise ...

## Usage

### Include

Include the module in your code-behind:

```javascript
var FortumoSMS = require('nativescript-fortumo-sms');
```

### Initialize

Initialize the environment:

```javascript
function onPageLoaded(args) {
    FortumoSMS.init();
}
exports.onPageLoaded = onPageLoaded;
```

The (optional) object that is submitted to the `PayPal.init` function has the following structure:

#### Properties

| Name  | Description  |
| ----- | ----------- |
| requestCode  | [OPTIONAL] The custom request code to use (e.g. for [Activity.onActivityResult](http://developer.android.com/reference/android/app/Activity.html#onActivityResult%28int,%20int,%20android.content.Intent%29) Android method). Default: `198612227`  |

### Start purchase

```javascript
function buyProduct(args) {
    // configure
    var purchase = FortumoSMS.newPurchase()
        .setId('<PRODUCT-ID>')
        .setName('test product')
        .setSecret('<APP-SECRET>')
        .setDisplayName('A test product')
        .setAmount('1.95')
        .setCurrency('USD');

    // start checkout / payment
    payment.start(function(cbResult) {
        switch (cbResult.code) {
            case 0:
                // SUCCESS
                // pay key is stored in 'cbResult.key'
                break;
                
            case 1:
                // CANCELLED
                break;
                
            case 2:
                // FAILED
                break;
                
            case 3:
                // PENDING
                break;
                
            case -1:
                // "unhandled exception"
                break;
        }
    });
}
exports.buyProduct = buyProduct;
```

## Enhancements

### Logging

If you want to get the logging output of the module, you can use `PayPal.addLogger` function to add a callback that receives a message from the module:

```javascript
PayPal.addLogger(function(msg) {
    console.log('[nativescript-paypal]: ' + msg);
});
```

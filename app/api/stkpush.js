const axios = require('axios');

const generateToken = async () => {

    const consumerKey = process.env.CONSUMER_KEY
    const consumerSecret = process.env.CONSUMER_SECRET

    //choose one depending on you development environment
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    try {

        const encodedCredentials = new Buffer.from(consumerKey + ":" + consumerSecret).toString('base64');

        const headers = {
            'Authorization': "Basic" + " " + encodedCredentials,
            'Content-Type': 'application/json'
        };

        const response = await axios.get(url, { headers });
        return response.data.access_token;
    } catch (error) {

        throw new Error('Failed to get access token.');
    }
}

async function sendStkPush(amount, mpesaNumber) {
    const token = await generateToken();
    const date = new Date();
    const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

    // you can use momentjs to generate the same in one line 

    const shortCode = process.env.YOUR_PAYBILL;
    const passkey = process.env.YOUR_PASSKEY;

    const stk_password = new Buffer.from(shortCode + passkey + timestamp).toString("base64");

    // choose one depending on your development environment
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    // const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    };

    const requestBody = {
        "BusinessShortCode": shortCode,
        "Password": stk_password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline", // till "CustomerBuyGoodsOnline"
        "Amount": amount,
        "PartyA": mpesaNumber,
        "PartyB": shortCode,
        "PhoneNumber": mpesaNumber,
        "CallBackURL": "https://qualityasoftwares.com/",
        "AccountReference": "QUALITY-A SOFTWARES",
        "TransactionDesc": "test"
    };

    try {
        const response = await axios.post(url, requestBody, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error sending STK push');
    }
}

module.exports = { sendStkPush };

// custom-server.js
const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const { sendStkPush } = require('./app/api/stkpush'); // Adjust the import path according to your project structure

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware to parse JSON bodies
  server.use(bodyParser.json());

  server.get('/', (req, res) => app.render(req, res, '/'));
  
  server.post('/api/makepayment', async (req, res) => {

    try {
      const { amount, mpesaNumber } = req.body;

      const stkResponse = await sendStkPush(amount, mpesaNumber);
      const callbackData = stkResponse?.data;

      // Check the result code
      const result_code = callbackData?.Body.stkCallback.ResultCode;
      if (result_code !== 0) {
        // If the result code is not 0, there was an error
        const error_message = callbackData?.Body.stkCallback.ResultDesc;
        const response_data = { ResultCode: result_code, ResultDesc: error_message };
        return res.status(400).json(response_data);
      }

      // If the result code is 0, the transaction was completed
      const body = callbackData?.Body.stkCallback.CallbackMetadata;

      // Get amount
      const amountObj = body.Item.find(obj => obj.Name === 'Amount');
      const famount = amountObj.Value;

      // Get Mpesa code
      const codeObj = body.Item.find(obj => obj.Name === 'MpesaReceiptNumber');
      const mpesaCode = codeObj.Value;

      // Get phone number
      const phoneNumberObj = body.Item.find(obj => obj.Name === 'PhoneNumber');
      const phone = phoneNumberObj.Value;

      const finalResponse = {
        amount: famount,
        mpesaCode: mpesaCode,
        phone: phone
      };

      return res.status(200).json(finalResponse);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }

  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

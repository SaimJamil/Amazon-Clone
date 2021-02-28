const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51IKgNILPL5v4UlqgUMxWoLen3WtnIlcr9W4OfLMJEVCGmi5r603NdCcikNvxZEllHXV1HRRQ1YzvOwmzJJJEO5sD00nvjOLSp2')


const app = express();

app.use(cors({ origin: true }));

app.use(express.json());

app.get('/', (request, response) => response.status(200).send('hello world'));

app.post('/payments/create', async (request, response) => {
    const total = request.query.total;
    console.log("payment request recieved for this amount", total);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "inr",
    });

    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})
     
exports.api = functions.https.onRequest(app);
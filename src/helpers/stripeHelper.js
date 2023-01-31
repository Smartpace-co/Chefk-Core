require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const apiKey = config.stripe.api_key;
const currency = config.stripe.currency;
const stripe = require("stripe")(apiKey);
const { protocol, host_root_path } = config.server;

module.exports = {
  createSession: async (package, customer, subscribeId, price) => {
    console.log("stripePrice: ", price);
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        success_url: `${protocol}://${host_root_path}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}&subscribe_id=${subscribeId}`,
        cancel_url: `${protocol}://${host_root_path}/paymentCancel`,
        customer,
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
      });
      return session;
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  createCustomer: async (email, name) => {
    try {
      const customer = await stripe.customers.create({
        email: email,
        name: name,
      });
      return customer;
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  getSession: async (sessionId) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  getSubscription: async (subscriptionId) => {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  listInvoices: async (customer) => {
    try {
      const invoices = await stripe.invoices.list({
        customer,
      });
      return invoices;
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  cancelSubscription: async (subscriptionId) => {
    try {
      const deleted = await stripe.subscriptions.del(subscriptionId);
      return deleted;
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
};

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const jwt = require('jsonwebtoken');
const stripe = require("stripe")(`${process.env.DB_Payment}`);
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = " shaad6798e79f5bb58";
const store_passwd = "shaad6798e79f5bb58@ssl";
const is_live = false; //true for live, false for sandbox

const port = process.env.PORT || 5000;
const app = express();

// middle ware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//  ssl commerce
// Store ID: shaad6798e79f5bb58
// Store Password (API/Secret Key): shaad6798e79f5bb58@ssl

// Store ID: shaad6798e79f5bb58
// Store Password (API/Secret Key): shaad6798e79f5bb58@ssl

// Merchant Panel URL: https://sandbox.sslcommerz.com/manage/ (Credential as you inputted in the time of registration)

// Store name: testshaadv2bl
// Registered URL: http://localhost:5173
// Session API to generate transaction: https://sandbox.sslcommerz.com/gwprocess/v3/api.php
// Validation API: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl
// Validation API (Web Service) name: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

// You may check our plugins available for multiple carts and libraries: https://github.com/sslcommerz

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.xfvkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const bioCollection = client.db("matriDB").collection("biodata");
    const favCollection = client.db("matriDB").collection("favdata");
    const contuctCollection = client.db("matriDB").collection("contuctdata");
    const successCollection = client.db("matriDB").collection("success");
    const paymentCollection = client.db("matriDB").collection("payment");
    const userCollection = client.db("matriDB").collection("user");
    const premimumCollection = client.db("matriDB").collection("premiumBio");

    //  auth related APIs =================
    // app.post('/jwt' , async(req,res) => {
    //   const user = req.body ;
    //   const token = jwt.sign(user , 'secret' , {
    //     expiresIn: '6h'
    //   })
    //   res.cookie('token' , token , {
    //     httpOnly: true,
    //     secure: false
    //   })
    //   .send({success: true})
    // })

    // app.post('/logout' , (req,res)=>{
    //   res.clearCookie(token,{
    //     httpOnly: true,
    //     secure: false
    //   })
    //   .send({success: true})
    // })

    // SSL Commerce

    const trx_Id = new ObjectId().toString();

    app.post("http://localhost:5000/order-bikash", async (req, res) => {
      const order = req.body;
      console.log(order);

      const data = {
        total_amount: order?.price,
        currency: "usd",
        tran_id: trx_Id, // use unique tran_id for each api call
        success_url: `http://localhost:5000/payment/success/${trx_Id}`,
        fail_url: `http://localhost:3030/fail/payment/fail/${trx_Id}`,
        cancel_url: "http://localhost:3030/cancel",
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: order?.email,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: order?.mobile,
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.send({ url: GatewayPageURL });

        const finalOrder = {
          order,
          paidStatus: false,
          transectionId: trx_Id,
        };
        const result = paymentCollection.insertOne(finalOrder);

        console.log("Redirecting to: ", GatewayPageURL);
      });

      app.post("/payment/success/:tran_id", async (req, res) => {
        const tranId = req.params.id;

        const result = await paymentCollection.updateOne(
          { transectionId: tranId },
          {
            $set: { paidStatus: true },
          }
        );

        if (result.modifiedCount > 0) {
          res.redirect(`http://localhost:5173/payment/success/${tranId}`);
        }
      });

      app.post("/payment/fail/:tran_id", async (req, res) => {
        const tranId = req.params.id;
         const result =await paymentCollection.deleteOne({ transectionId: tranId })

         if(result.deletedCount > 0){
          res.redirect(`http://localhost:5173/payment/fail/${tranId}`);
         }
      });
    });

    // Total Dashboard Count ============

    app.get("/admin-stats", async (req, res) => {
      const bio = await bioCollection.find().toArray();
      const male = bio.filter((b) => b.gender == "Male");
      const female = bio.filter((b) => b.gender == "Female");
      const maleData = male.length;
      const femaleData = female.length;

      // Good Way  ===========
      const boys = await bioCollection.countDocuments({ gender: "Male" });
      const girls = await bioCollection.countDocuments({ gender: "Female" });
      const biodata = await bioCollection.estimatedDocumentCount();
      const users = await userCollection.estimatedDocumentCount();
      const premium = await premimumCollection.estimatedDocumentCount();
      const successStory = await successCollection.estimatedDocumentCount();
      const payments = await paymentCollection.find().toArray();
      const revinew = payments.reduce((start, total) => start + total.price, 0);

      res.send({ biodata, premium, users, successStory, revinew, boys, girls });
    });

    //   Bio data APIs ==========================

    let biodataId = 0;
    app.post("/biodata", async (req, res) => {
      biodataId++;
      const biodata = req.body;
      let newbioData = { ...biodata, biodataId };
      const result = await bioCollection.insertOne(newbioData);
      res.send(result);
    });

    app.get("/biodata", async (req, res) => {
      const division = req.query.division;
      const gender = req.query.gender;
      let query = {};
      if (division) {
        query.division = division;
      }
      if (gender) {
        query.gender = gender;
      }
      const result = await bioCollection.find(query).toArray();
      res.send(result);
    });

    //  premium request bio data =====================

    app.post("/premium-biodata", async (req, res) => {
      const biodata = req.body;
      const result = await premimumCollection.insertOne(biodata);
      res.send(result);
    });

    app.get("/premium-biodata", async (req, res) => {
      const result = await premimumCollection.find().toArray();
      res.send(result);
    });

    app.patch("/premium-biodata/:id", async (req, res) => {
      const premium = req.body;
      const id = req.params.id;
      const query = { _id: id };
      const update = { $set: { role: "premium" } };
      const result = await premimumCollection.updateOne(query, update);
      res.send(result);
    });

    //  favourate Data =========================

    app.put("/biodata/:id", async (req, res) => {
      const biodata = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const update = {
        $set: {
          name: biodata.name,
          image: biodata.image,
          age: biodata.age,
          father: biodata.father,
          mother: biodata.mother,
          partnerAge: biodata.partnerAge,
          partnerHeight: biodata.partnerHeight,
          mobile: biodata.mobile,
          gender: biodata.gender,
          date: biodata.date,
          height: biodata.height,
          weight: biodata.weight,
          occupation: biodata.occupation,
          race: biodata.race,
          division: biodata.division,
          presentdivision: biodata.presentdivision,
          partnerWeight: biodata.partnerWeight,
          role: biodata.role,
          email: biodata.email,
        },
      };

      const result = await bioCollection.updateOne(query, update);
      res.send(result);
    });

    //  favourate data APIs
    app.post("/favourate", async (req, res) => {
      const { _id, ...favdata } = req.body;
      const result = await favCollection.insertOne(favdata);
      res.send(result);
    });

    app.get("/favourate", async (req, res) => {
      const result = await favCollection.find().toArray();
      res.send(result);
    });

    app.delete("/favourate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await favCollection.deleteOne(query);
      res.send(result);
    });

    // contuct collection APIs ==================

    app.post("/contuct", async (req, res) => {
      const contuctdata = req.body;
      const result = await contuctCollection.insertOne(contuctdata);
      res.send(result);
    });

    app.get("/contuct", async (req, res) => {
      const result = await contuctCollection.find().toArray();
      res.send(result);
    });

    // Success Story APIs

    app.post("/success", async (req, res) => {
      const successtdata = req.body;
      const result = await successCollection.insertOne(successtdata);
      res.send(result);
    });

    app.get("/success", async (req, res) => {
      const result = await successCollection.find().toArray();
      res.send(result);
    });

    //  user releted APIs =======================

    app.post("/users", async (req, res) => {
      const userdata = req.body;
      const result = await userCollection.insertOne(userdata);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;

      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: {
          admin: "admin",
        },
      };

      const result = await userCollection.updateOne(filter, update);
      res.send(result);
    });

    app.patch("/users/premium/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;

      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: {
          userRole: "premimum",
        },
      };

      const result = await userCollection.updateOne(filter, update);
      res.send(result);
    });

    // payment intent APIs =======================

    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;

      const amount = parseFloat(price * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });

      app.post("/payments", async (req, res) => {
        const paymentdata = req.body;
        const result = await paymentCollection.insertOne(paymentdata);
        res.send(result);
      });

      app.get("/payments", async (req, res) => {
        const result = await paymentCollection.find().toArray();
        res.send(result);
      });

      app.patch("/payments/:id", async (req, res) => {
        const id = req.params.id;
        const user = req.body;

        const filter = { _id: new ObjectId(id) };
        const update = {
          $set: {
            status: "approved",
          },
        };

        const result = await paymentCollection.updateOne(filter, update);
        res.send(result);
      });

      app.delete("/payments/:id", async (req, res) => {
        const body = req.body;
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await paymentCollection.deleteOne(query);
        res.send(result);
      });
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("data is Loading!");
});

app.listen(port, () => {
  console.log("server is connected to the a at:", port);
});

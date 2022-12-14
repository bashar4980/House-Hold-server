const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

//database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2mvagza.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // await client.connect();
    const serviceCollection = client
      .db("houseHoldsServices")
      .collection("services");
    const reviewsCollection = client
      .db("houseHoldsServices")
      .collection("reviews");
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });
    //
    app.get("/allservices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //find a signle element of database
    app.get("/services/:id", async (req, res) => {
      const serviceId = req.params.id;

      const query = { _id: ObjectId(serviceId) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });
    //

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      res.send({ token });
    });
    //get all reviews

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query).sort({ _id: -1 });
      //$gt:ObjectId("502aa46c0674d23e3cee6152")}}).sort({"_id":1}
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    //store review
    app.post("/services/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    }),
      app.post("/services", async (req, res) => {
        const review = req.body;
        console.log(review);
        const result = await serviceCollection.insertOne(review);
        res.send(result);
      });
    //end
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(filter);
      res.send(result);
    });

    //
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
     

      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.findOne(query);
      res.send(result);
      
    });
    app.put("/reviews/:id", async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const Updatereview = req.body;
      const filter = {_id:ObjectId(id)}
      const options = { upsert: true };
    
      console.log(Updatereview)
      const updateDoc = {
        $set: {
           message: Updatereview.message
        },
      };
      const result = await reviewsCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    //end
  } finally {
  }
}
run().catch((err) => console.log(err));

//databse

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

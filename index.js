const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json())

//database




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2mvagza.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
     try{
        await client.connect();
       const serviceCollection=client.db('houseHoldsServices').collection("services");
       app.get('/services' , async(req,res)=>{
         const query = {};
         const cursor = serviceCollection.find(query);
         const result = await cursor.toArray();
         res.send(result)
       })
     }
     finally{

     }
    }
run().catch(err =>console.log(err))


//databse

app.get("/", (req,res)=>{
    res.send("Server is running");
})
app.listen(port ,()=>{
    console.log(`server is running on port: ${port}`)
})
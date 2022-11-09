const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json())

//database




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2mvagza.mongodb.net/?retryWrites=true&w=majority`;

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
       //find a signle element of database
       app.get('/services/:id', async(req,res)=>{
        const serviceId = req.params.id;
       
        const query = {_id: ObjectId(serviceId)};
        const result = await serviceCollection.findOne(query);
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
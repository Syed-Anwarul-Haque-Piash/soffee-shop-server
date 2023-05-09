const express = require('express');
const cors=require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//syed88783
//E0uY5PfjdoRgehES
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snq97yo.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://syed88783:E0uY5PfjdoRgehES@cluster0.snq97yo.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection=client.db('coffeeDb').collection('coffee');

    app.get('/coffee',async(req,res)=>{
        const result=await coffeeCollection.find().toArray();
        res.send(result);
    })

    app.get('/coffee/:id',async(req,res)=>{
        const id=req.params.id;
        const result=await coffeeCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
    });

    app.post('/coffee',async(req,res)=>{
        const newCoffee=req.body;
        console.log(newCoffee);
        const result=await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    });

    app.put('/coffee/:id',async(req,res)=>{
        const id=req.params.id;
        const options = { upsert: true };
        const updatedCoffee={
            $set:{
                name:req.body.name,
                details:req.body.details,
                photo:req.body.photo,
                category:req.body.category,
                quantity:req.body.quantity,
                supplier:req.body.supplier,
                taste:req.body.taste
            }
        }
        const result=await coffeeCollection.updateOne({ _id: new ObjectId(id) }, updatedCoffee, options);
        res.send(result);
    });

    app.delete('/coffee/:id', async(req, res)=>{
        const id=req.params.id;
        const result=await coffeeCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result)
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Coffee making server is running')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
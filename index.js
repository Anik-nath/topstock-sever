const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
var cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.8qp7t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("topstock");
    const productCollection = database.collection("shop");
    const orderCollection = database.collection("orders");

    //load all data 
    app.get('/shop', async(req,res)=>{
        const cursor = productCollection.find({});
        const allProducts = await cursor.toArray();
        res.send(allProducts);
    })
    app.get('/orders', async(req,res)=>{
      const email = req.query.email;
        const query = {email: email};
        const cursor = orderCollection.find(query);
        const allorders = await cursor.toArray();
        res.send(allorders);
    })
    //details by single product
    app.get('/productdetails/:id', async (req,res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id)};
      const singleProduct = await productCollection.findOne(query);
      res.json(singleProduct); 
    })
    //place order
    app.post('/orders',async (req,res)=>{
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      res.send(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("top stock server welcome");
});

app.listen(port, () => {
  console.log(`top stock app listening at http://localhost:${port}`);
});

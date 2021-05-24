const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 5000

app.get('/', (req, res) => {
  res.send('hello from db its working')
})
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.t43iz.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnDB").collection("products");
  const ordersCollection = client.db("emaJohnDB").collection("orders");

  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })

  app.get('/products',(req,res) => {
    productsCollection.find({}).limit(20)
    .toArray((err, documents) =>{ 
      res.send(documents);
    })
  })

  app.get('/product/:key',(req,res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) =>{ 
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })


}),

  



app.listen(process.env.PORT || port)
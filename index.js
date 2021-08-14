const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://user3:RlYmmb4pB71RxA6A@cluster0.raxaw.mongodb.net/database3?retryWrites=true&w=majority";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("database3").collection("organicProduct");

  app.post('/addProduct', (req, res) => {
    const product = req.body
    console.log(product)
    productCollection.insertOne(product)
      .then(result => {
        console.log('form added')
      })
    res.redirect('/')
  })

  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })

  })

  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { name: req.body.name, quantity: req.body.quantity }
      }
    )
      .then(result => {
        res.send(result)
      })
  })



  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0])
      })
  })

});



app.listen(3000, () => console.log('Running Fine'))
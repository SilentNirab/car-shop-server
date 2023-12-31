const express = require('express');
const cros = require('cors');
require(`dotenv`).config();
const app = express();
const port = process.env.PROT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// midelware
app.use(cros());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ezxu64p.mongodb.net/?retryWrites=true&w=majority`;

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

    const carCollection = client.db('carDB').collection('car');

    app.get('/car', async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

      app.get('/car/:id', async(req, res) =>{
      const id = req.params.id;
      const query  = {_id: new ObjectId(id)};
      const result = await carCollection.findOne(query);
      res.send(result);
      })

    app.post('/car', async (req, res) => {
        const newCar = req.body;
        console.log(newCar);
        const result = await carCollection.insertOne(newCar);
        res.send(result);
    })

    app.put('/car/:id', async(req, res) =>{
      const id = req.params.id;
      const filter  = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedCar = req.body;
      const car = {
          $set: {
            image: updatedCar.image,
            name: updatedCar.name,
            brand: updatedCar.brand,
            type: updatedCar.type,
            price: updatedCar.price,
            description: updatedCar.description,
            rating: updatedCar.rating,
          }
      }
      const result = await carCollection.updateOne(filter, car, options);
      res.send(result);
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('Brand shop is running');
})

app.listen(port, () =>{
    console.log(`Brand shop is running on prot : ${port}`);
})
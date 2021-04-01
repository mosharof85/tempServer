const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();



const app = express()
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zqwdr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('Connection Error', err);

    const products = client.db(`${process.env.DB_NAME}`).collection("products");

    app.post('/addProduct', (req, res)=>{
        products.insertOne(req.body)
            .then(result=>{
                res.send(result.insertedCount > 0);
            })
    })

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
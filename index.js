const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
    const orders = client.db(`${process.env.DB_NAME}`).collection("orders");

    app.post('/addOrder', (req, res)=>{
        orders.insertOne(req.body)
            .then(result=>{
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/orders/:email', (req, res)=>{

        const email = (req.params.email);
        const ids = [];

        orders.find({email: email})
            .toArray((err, orders) =>{
                orders.forEach(item=>{
                    ids.push(ObjectID(item.productID))
                })

                products.find({
                    _id: {
                        $in: ids
                    }
                })
                    .toArray((err, products) =>{
                        res.send(products);
                })

            })
    })

    app.post('/addProduct', (req, res)=>{
        products.insertOne(req.body)
            .then(result=>{
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/products', (req, res)=>{
        products.find()
            .toArray((err, items) =>{
                res.send(items);
            })
    })

    app.get('/product/:id', (req, res)=>{

        const id = ObjectID(req.params.id);

        products.find({_id: id})
            .toArray((err, items) =>{
                res.send(items[0]);
            })
    })

    app.delete('/deleteProduct/:id', (req, res)=>{
        const id = ObjectID(req.params.id);

        products.findOneAndDelete({_id: id}, (err, result)=>{
            console.log(result)
            if (err)
            {
                res.send(err)
            }
            else {
                res.send(result)
            }
        })
    })
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
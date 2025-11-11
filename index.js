const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// middleware----
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycluster.sc65jvq.mongodb.net/?appName=myCluster`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('server is running')
})


async function run() {
    try {
        await client.connect();
        const sebajatraDB = client.db('sebajatra_db');
        const upcomingEvents = sebajatraDB.collection('upcomingEvents')
        const userCollection = sebajatraDB.collection('users');
        const createEventCollection = sebajatraDB.collection('createEvent')


        app.get('/upcoming-events', async (req, res) => {
            const cursor = upcomingEvents.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/upcoming-events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await upcomingEvents.findOne(query);
            res.send(result)
        })


        // save database new google user login data----
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email };
            const existUser = await userCollection.findOne(query);
            if (existUser) {
                res.send({ message: 'user already exists.DO not need to insert again' })
            }
            else {
                const result = await userCollection.insertOne(newUser)
                res.send(result)
            }
        })

        // createEvent user save database---
        app.post('/create-event', async (req, res) => {
            const newEvent = req.body;
            const result = await createEventCollection.insertOne(newEvent);
            res.send(result);
        })

        // get joined event? email =user@12.com----
        app.get('/joined-evnet', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                return res.status(400).send({ message: "email required" });
            }
            const events = await createEventCollection
                .find({ userEmail: email })
                .sort({ data: 1 })
                .toArray();
            res.send(events)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () =>
    console.log(`server is running on port ${port}`)
)
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/upcoming-events', async (req, res) => {
            const cursor = upcomingEvents.find();
            const result = await cursor.toArray();
            res.send(result)
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
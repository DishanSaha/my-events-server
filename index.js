const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');



// middleware----
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://SebajatradbUser:yW9FH8PTVBnlCC3G@mycluster.sc65jvq.mongodb.net/?appName=myCluster";

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
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () =>
    console.log(`server is running on port ${port}`)
)
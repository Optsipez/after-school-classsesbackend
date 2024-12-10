const express = require('express');
const app = express();
const path = require("path");
const { MongoClient, ObjectID } = require('mongodb');


// Serve static assets
// app.use('/assets', express.static(path.resolve(__dirname, "assets")));




var imagePath = path.resolve(__dirname, "assets");
app.use('/assets', express.static(imagePath));

app.use("/assets", express.static(imagePath));






// Middleware to handle missing image static files
app.get("/assets/:image", (req, res) => {
    res.status(404).send("Static file not found");
});

// Config Express.js
app.use(express.json());
app.set('port', 3000);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Connect to MongoDB
let db;
MongoClient.connect(
    'mongodb+srv://vishesh:vishesh27@afs.4jxdc.mongodb.net/',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if (err) {
            console.error("Error connecting to MongoDB:", err);
            return;
        }
        db = client.db('webstore');
        console.log("Connected to MongoDB");
    }
);

// Parameter Middleware for collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next();
});

// Retrieve all objects from a collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e);
        res.send(results);
    });
});

// Add a document to a collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (e, result) => {
        if (e) return next(e);
        res.send(result.ops[0]);
    });
});

// Retrieve a document by ID
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e);
        res.send(result);
    });
});

// Update a document by ID
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.updateOne(
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e);
            res.send(result.matchedCount === 1 ? { msg: 'success' } : { msg: 'error' });
        }
    );
});

// Start the server
const PORT = app.get('port');
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Import required modules
const express = require('express'); // Framework for building web applications
const app = express(); // Create an instance of an Express application
const path = require("path"); // Module to handle and transform file paths
const { MongoClient, ObjectID } = require('mongodb'); // MongoDB client and ObjectID for working with the database

// Logger Middleware: Logs incoming requests and their response status
function logger(req, res, next) {
    const method = req.method; // HTTP method (e.g., GET, POST)
    const url = req.url; // Requested URL
    const timestamp = new Date(); // Timestamp of the request

    console.log(`[${timestamp}] ${method} request to ${url}`);

    // Log response status after the request is completed
    res.on('finish', () => {
        console.log(`[${timestamp}] Response status: ${res.statusCode}`);
    });

    next(); // Pass control to the next middleware
}

// Use the logger middleware globally
app.use(logger);

// Serve static assets (e.g., images, CSS, JavaScript) from the "assets" directory
const imagePath = path.resolve(__dirname, "assets"); // Resolve the path to the "assets" directory
app.use('/assets', express.static(imagePath));

// Middleware to handle Cross-Origin Resource Sharing (CORS)
// Allows requests from different origins for the APIs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow cookies or authentication headers
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT"); // Allowed HTTP methods
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Allowed headers
    next(); // Pass control to the next middleware
});

// Handle missing static files by returning a 404 response
app.get("/assets/:image", (req, res) => {
    res.status(404).send("Static file not found");
});

// Configure Express to parse JSON request bodies
app.use(express.json());

// Set the port for the application
app.set('port', 3000);

// Connect to MongoDB database
let db; // Database instance
MongoClient.connect(
    'mongodb+srv://vishesh:vishesh27@afs.4jxdc.mongodb.net/',
    { useNewUrlParser: true, useUnifiedTopology: true }, // Connection options
    (err, client) => {
        if (err) {
            console.error("Error connecting to MongoDB:", err);
            return;
        }
        db = client.db('webstore'); // Connect to the "webstore" database
        console.log("Connected to MongoDB");
    }
);

// Parameter Middleware: Adds the specified collection to the request object
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName); // Attach the collection to the request
    return next(); // Pass control to the next middleware
});

// Retrieve all objects from a specified collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e); // Handle errors
        res.send(results); // Send all documents in the collection as a response
    });
});

// Root route: Provide instructions on how to use the API
app.get('/', (req, res) => {
    res.send('Select a collection, e.g., /collection/lessons');
});

// Add a new document to a specified collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (e, result) => {
        if (e) return next(e); // Handle errors
        res.send(result.ops[0]); // Return the newly added document
    });
});

// Retrieve a document by its ObjectID
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e); // Handle errors
        res.send(result); // Return the found document
    });
});

// Update a document by its ObjectID
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.updateOne(
        { _id: new ObjectID(req.params.id) }, // Match the document by ID
        { $set: req.body }, // Update with new data
        { safe: true, multi: false }, // Options: ensure safety, update one document
        (e, result) => {
            if (e) return next(e); // Handle errors
            res.send(result.matchedCount === 1 ? { msg: 'success' } : { msg: 'error' }); // Send success or error message
        }
    );
});

// Search for documents in a collection based on a search term
app.get('/search/:collectionName', (req, res, next) => {
    const searchTerm = req.query.q || ""; // Get the search term from the query string
    const searchRegex = new RegExp(searchTerm, "i"); // Case-insensitive regex for substring matching

    const query = {
        $or: [ // Match any of the fields
            { name: searchRegex },
            { location: searchRegex },
            { price: { $regex: searchRegex } }, // Match price as a string
            { availableSeats: { $regex: searchRegex } }, // Match availability as a string
            { description: searchRegex },
        ],
    };

    req.collection.find(query).toArray((err, results) => {
        if (err) {
            console.error("Error executing search query:", err);
            return next(err); // Handle errors
        }
        res.send(results); // Send the filtered results
    });
});

// Start the server on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express.js server running at localhost:${port}`);
});

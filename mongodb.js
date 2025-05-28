require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://task-manager:8xV6VIRQIxbvQslA@cluster0.xfvkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("task-manager");
    const tasksCollection = db.collection("tasks");
    const commonCollection = db.collection("commons");


  app.post("/commons", async(req,res)=>{
      const common = req.body;
      const result = await commonCollection.insertOne(common);
      res.send(result)
  })
  app.get("/commons", async (req, res) => {
    const category = req.query.category;
    let query = {};
    if(category){
      query.category = category
    }
    const result = await commonCollection.find(query).toArray();
    res.send(result);
  });

    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    app.get("/tasks", async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);

      res.send(result);
    });

    app.patch("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateTask = req.body;
      const task = {
        $set: {
          title: updateTask.title,
          category: updateTask.category,
          deadline: updateTask.deadline,
          description: updateTask.description,
        },
      };

        const result = await tasksCollection.updateOne(filter,task)
        res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// API Routes
app.get("/", (req, res) => {
  res.send("Task Management API Running...");
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

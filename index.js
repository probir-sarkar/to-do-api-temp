const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse the request body as JSON

// Create a schema for the database
const todoSchema = new mongoose.Schema({
  id: String,
  content: String,
  isCompleted: Boolean,
});
const Todo = mongoose.model("to-do-list", todoSchema);

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/to-do-list", {})
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB database", err);
  });

app.post("/add-todos", async (req, res) => {
  const newTodos = req.body;

  try {
    // Delete all existing to-do items
    await Todo.deleteMany({});

    // Insert the new set of to-do items
    const result = await Todo.insertMany(newTodos);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/get", async (req, res) => {
  // Add the async keyword to use await inside the route
  try {
    const todos = await Todo.find(); // Use await to wait for the find operation to complete
    res.status(200).json(todos); // Use res.json() to send the JSON response
  } catch (err) {
    res.status(400).send(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

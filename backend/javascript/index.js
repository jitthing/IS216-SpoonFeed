const express = require("express");

const cors = require("cors");

require("dotenv").config();

// Server settings
const PORT = 8000;
const app = express();

app.use(express.json()); // Tells our server to read and understand JSON objects
app.use(cors()); // Tells the server to allow communication across origins

app.use("/api", require("./router/appRouter.js"));

app.get("/", (req, res) => {
  return res.send("this is the backend");
});

app.listen(PORT, () => {
  console.log(`[SYSTEM] Server started on port ${PORT}...`);
});

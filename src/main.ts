import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
console.log("Hello, World!", process.env.PORT);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

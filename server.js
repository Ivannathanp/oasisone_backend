import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import restaurant from "./routes/restaurant.js";
import user from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected successfully");
});

app.use('/admin', restaurant);
app.use('/user', user);

app.listen(port, () => {
    console.log('Server is running on port:' , port );
});
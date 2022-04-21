import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import management from "./routes/management.js";
import tenant from "./routes/tenant.js";
import user from "./routes/user.js";
import order from "./routes/order.js";
import promo from "./routes/promo.js";
import menu from "./routes/menu.js";
import table from "./routes/table.js";

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

app.use('/api/management', management);
app.use('/api/tenant', tenant);
app.use('/api/user', user);
app.use('/api/order', order);
app.use('/api/promo', promo);
app.use('/api/menu', menu);
app.use('/api/table', table); 

app.listen(port, () => {
    console.log('Server is running on port:' , port );
});
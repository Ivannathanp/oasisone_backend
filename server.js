import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Models
import Tenant from "./models/tenantModel.js";

// Routes
import management from "./routes/management.js";
import tenant from "./routes/tenant.js";
import user from "./routes/user.js";
import order from "./routes/order.js";
import promo from "./routes/promo.js";
import menu from "./routes/menu.js";
import table from "./routes/table.js";
import waiter from "./routes/waiter.js";
import images from "./routes/images.js";
import contract from "./routes/contract.js";

dotenv.config();

const app = express();
const httpServer  = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  }
});

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

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
app.use('/api/waiter', waiter);
app.use('/api/images', images);
app.use('/api/contract', contract); 

let online = 0;

io.on('connection', (socket) => {
  online++;
  const tenant_id = socket.handshake.query.tenant_id
  console.log( tenant_id + " client is connected with " + socket.id);
  console.log(`Online: ${online}`);
  io.emit('visitor enters', online);

  
  socket.on('add table', data => socket.broadcast.emit('add table', data));
  socket.on('update user', data => socket.broadcast.emit('update user', data));
  socket.on('delete', data => socket.broadcast.emit('delete', data));



  socket.on('disconnect', () => {
    online--;
    console.log(`Socket ${socket.id} disconnected.`);
    console.log(`Online: ${online}`);
    io.emit('visitor exits', online);
  });
});


httpServer.listen(port, () => {  
  console.log('Server and socket is running on port:' , port );
});

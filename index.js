const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { connection } = require("./config/db");
const UserRouter = require("./router/User.Router");




app.use(express.json());

// Routers 
app.use('/', UserRouter);

// Home route


// html file path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.send(`<h1> Social Media app </h1>`);
});

// one user connected
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('hi');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });


});



// connection to server

server.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(`server app  listening on port ${process.env.port}`);
  } catch (error) {
    console.log({ error: `error in connections with the  port: ${error.message}` });
  }
});

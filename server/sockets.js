const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("./config/auth.config.js");

function startSocketServer(app) {
  const io = new Server(app);

  io.on("connection", (socket) => {
    const { token, role, trade } = socket.handshake.auth;
    if (!token) {
      console.log("No auth token.");
      socket.disconnect();
    } else {
      let verified = false;

      // Verify auth token
      jwt.verify(token, config.salt, (error, decoded) => {
        if (error) {
          console.log("User not authorized.");
          socket.disconnect();
        } else {
          verified = true;
        }
        console.log("User ID: " + decoded.id);
      });

      // Check if user is their respective role ()
      if (verified) {
      }
    }

    socket.on("send_message", (data) => {
      console.log(data);
      io.emit("new_message", data);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });
}

module.exports = {
  startSocketServer
};

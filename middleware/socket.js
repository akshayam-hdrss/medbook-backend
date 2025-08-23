let io;

function initSocket(server) {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*", // ⚠️ allow all for testing, restrict in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔗 New client connected:", socket.id);

    // ✅ User or Doctor joins a personal room
    socket.on("join", ({ type, id }) => {
      if (type && id) {
        const room = `${type}_${id}`; // e.g. "user_12" or "doctor_5"
        socket.join(room);
        console.log(`📌 ${type} with ID ${id} joined room: ${room}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized! Call initSocket first.");
  }
  return io;
}

module.exports = { initSocket, getIO };

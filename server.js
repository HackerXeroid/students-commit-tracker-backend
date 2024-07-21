const app = require("./app");
const mongoose = require("mongoose");

const connectionString = process.env.MONGO_DB_CONNECTION_STRING.replace(
  "<USER>",
  process.env.MONGO_DB_USER
).replace("<PASSWORD>", process.env.MONGO_DB_PASSWORD);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`The server is listening on PORT ${PORT}`);
  mongoose.connect(connectionString);

  const db = mongoose.connection;

  db.on("connected", () => {
    console.log("Connected to MongoDB successfully.");
  });

  db.on("error", () => {
    console.log("Error while connecting to MongoDB");
  });
});

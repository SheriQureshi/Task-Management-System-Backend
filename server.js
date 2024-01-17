const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const db = require("./models");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const cors = require("cors")
app.use(cors());
const sequelize = new Sequelize({
  host: "bcappa-dev.cwunv2qtvlsh.us-east-1.rds.amazonaws.com",
  username: "bcappa_dev_admin",
  password: "e9MlIfbyYeoHnNDiXnzA",
  database: "taska-sheraz",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
app.use(express.json());

app.use("/api", userRoute);
app.use("/api", taskRoute);


// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API!');
});
db.sequelize.sync().then((req) => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});

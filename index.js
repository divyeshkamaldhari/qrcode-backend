const express = require("express");
const { connectionDB } = require("./config/connectionDB");
const { mainRouter } = require("./src/routes");
const cors = require("cors");
require("dotenv").config();
connectionDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", mainRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running on port : ", process.env.PORT);
});

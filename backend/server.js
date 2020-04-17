const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const apiRouter = require('./routes/api.routes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose
  .connect(config.get("mongoURI"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((error) => console.error(error));

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.send("not found...");
});

app.listen(config.get("backendPort"), config.get("backendHost"), () => {
  console.log(`Server started ${config.get("backendHost")}:${config.get("backendPort")}`);
});

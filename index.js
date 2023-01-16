const express = require("express");
const cors = require("cors");

const { connection } = require("./config/db");
const { userRouter } = require("./routes/usersRoutes");
const {
  authenticateMiddleware,
} = require("./middleware/authenticateMiddleware");
const { postRouter } = require("./routes/postRoutes");

const app = express();
require("dotenv").config();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/users", userRouter);
//app.use(authenticateMiddleware);
app.use("/posts", postRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected successfully with DB");
  } catch (error) {
    console.log(error);
    console.log("Error while connecting with DB");
  }
  console.log(`Running at port ${process.env.port}`);
});

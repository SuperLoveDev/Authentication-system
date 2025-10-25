import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "You gonna make it" });
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}/api`);
});
server.on("error", (err) => {
  console.log("Server error:", err);
});

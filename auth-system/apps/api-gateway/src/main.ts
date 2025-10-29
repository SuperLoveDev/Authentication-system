import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import proxy from "express-http-proxy";
import rateLimit from "express-rate-limit";
import * as path from "path";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.set("trust proxy", 1);

// rate limit for abusif api request
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: "Too many request, Please try again later" },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req: any) => req.ip,
});

app.use(limiter);

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

app.use("/", proxy("http://localhost:4000"));

const port = process.env.PORT || 5050;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);

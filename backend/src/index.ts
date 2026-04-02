import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { MongoClient } from "./database/mongo";
import userRoutes from "./routes/user/user-routes";

const main = async () => {
  config();
  const app = express();
  const port = process.env.PORT || 8000;

  await MongoClient.connect();

  // Middlewares
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cors());
  app.use(express.json());

  app.use(userRoutes);

  app.listen(port, () => console.log(`listening on port ${port}!`));
};

main();

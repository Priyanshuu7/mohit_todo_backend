import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";
import todoRoutes from "./routes/todoroutes.js";

const app: Application = express();
const PORT = process.env.PORT || 7000;


// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("Server is Working");
});

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);


app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

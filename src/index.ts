import "express-async-errors";
import router from "./routes";
import express from "express";

import * as dotenv from "dotenv";
import './database/models'
dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Express  Server"));
app.use("/api", router);
app.all("*", (req, res) => res.status(404).json({ data: "Route not found" }));

app.use((err, req, res, next) => {
    next(err);
    return res.status(500).json({ error: "Internal Server Error" });
});
const PORT = process.env.PORT || 3434;


app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at ${PORT}`);
});

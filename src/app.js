import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import gamesRouters from "./routers/games.routers.js";
import customersRouters from "./routers/customers.routers.js";
import rentalsRouters from "./routers/rentals.routers.js";

dotenv.config();

const app = express();
app.use(express.json())
app.use(cors())

app.use(gamesRouters)
app.use(customersRouters)
app.use(rentalsRouters)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
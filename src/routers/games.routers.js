import { Router } from "express";
import { insertGame, getGames } from "../controllers/games.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gamesSchema } from "../schemas/game.schema.js";

const gamesRouters = Router();

gamesRouters.post("/games", validateSchema(gamesSchema), insertGame);
gamesRouters.get("/games", getGames);

export default gamesRouters
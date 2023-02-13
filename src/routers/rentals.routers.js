import { Router } from "express";
import { endRental, getRentals, insertRental } from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalsSchema } from "../schemas/rental.schema.js";

const rentalsRouters = Router()

rentalsRouters.get("/rentals", getRentals)
rentalsRouters.post("/rentals", validateSchema(rentalsSchema), insertRental)
rentalsRouters.post("/rentals/:id/return", endRental)

export default rentalsRouters
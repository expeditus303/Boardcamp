import { Router } from "express";
import { deleteRental, endRental, getRentals, insertRental } from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalsSchema } from "../schemas/rental.schema.js";

const rentalsRouters = Router()

rentalsRouters.get("/", getRentals)
rentalsRouters.post("/", validateSchema(rentalsSchema), insertRental)
rentalsRouters.post("/:id/return", endRental)
rentalsRouters.delete("/:id", deleteRental)

export default rentalsRouters
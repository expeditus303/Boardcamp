import { Router } from "express";
import { editCustomer, getCustomer, getCustomers, insertCustomer } from "../controllers/customers.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";

const customersRouters = Router();

customersRouters.get("/customers", getCustomers);
customersRouters.get("/customers/:id", getCustomer)
customersRouters.post("/customers", validateSchema(customerSchema), insertCustomer);
customersRouters.put("/customers/:id", validateSchema(customerSchema), editCustomer)

export default customersRouters
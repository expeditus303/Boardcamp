import joi from "joi";

export const rentalsSchema = joi.object({
    customerId: joi.number().min(1).integer().required(),
    gameId: joi.number().min(1).integer().required(),
    daysRented: joi.number().min(1).integer().required(),
  });
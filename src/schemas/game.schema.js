import joi from "joi";

export const gamesSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string().min(3).required(),
    stockTotal: joi.number().min(1).integer().required(),
    pricePerDay: joi.number().min(1).integer().required(),
  });
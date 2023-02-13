import joi from "joi";

export const customerSchema = joi.object({
    name: joi.string().min(3).required(),
    phone: joi.string().pattern(/^\d+$/).min(10).max(11).required(),
    cpf: joi.string().pattern(/^\d+$/).length(11).required(),
    birthday: joi.date().required(),
  });
const Joi = require('@hapi/joi')

// Joi NPM to validate the data first
const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  street: Joi.string()
    .min(3)
    .required(),
  city: Joi.string()
    .min(3)
    .required(),
  state: Joi.string()
    .min(3)
    .required(),
  country: Joi.string()
    .min(3)
    .required()
});

module.exports = schema
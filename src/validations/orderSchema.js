const Joi = require('joi');

// ===== ORDERS =====
const orderSchemas = {
  addOrder: Joi.object({
    owner_id: Joi.number().integer().required(),
    order_name: Joi.string().required(),
    typeOrder: Joi.string().required(),
    desc: Joi.string().allow('').optional(),
    start_date: Joi.date().required(),
    due_date: Joi.date().required()
  }),

  updateOrder: Joi.object({
    owner_id: Joi.number().integer().required(),
    order_name: Joi.string().required(),
    typeOrder: Joi.string().required(),
    desc: Joi.string().allow('').optional(),
    statusOrder: Joi.string().required(),
    start_date: Joi.date().required(),
    due_date: Joi.date().required()
  }),

  updateStatus: Joi.object({
    statusOrder: Joi.string().required()
  })
}

module.exports = orderSchemas;
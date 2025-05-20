const Joi = require('joi');

// ===== TASKS =====
const taskSchemas = {
  addTask: Joi.object({
    order_id: Joi.number().integer().required(),
    worker_id: Joi.number().integer().required(),
    role_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().required(),
    note: Joi.string().allow('').optional(),
    start_date: Joi.date().required(),
    due_date: Joi.date().required()
  }),

  updateTask: Joi.object({
    role_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().required(),
    note: Joi.string().allow('').optional(),
    start_date: Joi.date().required(),
    due_date: Joi.date().required()
  })
}

module.exports = taskSchemas;
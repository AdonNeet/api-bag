const Joi = require('joi');

// ===== TASKS =====
const taskSchemas = {
  addTask: Joi.object({
    order_id: Joi.number().integer().required(),
    worker_id: Joi.number().integer().required(),
    typeTask: Joi.string().required(),
    desc: Joi.string().allow('').optional(),
    start_date: Joi.date().required(),
    due_date: Joi.date().required()
  }),

  updateTask: Joi.object({
    typeTask: Joi.string().required(),
    desc: Joi.string().allow('').optional(),
    start_date: Joi.date().required(),
    due_date: Joi.date().required()
  })
}

module.exports = taskSchemas;
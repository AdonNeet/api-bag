const Joi = require('joi');

// ===== USERS =====
const userSchemas = {
    addUser: Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    }),

    updateUser: Joi.object({
        name: Joi.string().min(3).optional(),
        password: Joi.string().min(6).optional()
    }),

    login: Joi.object({
        name: Joi.string().required(),
        password: Joi.string().required()
    }),

    addWorker: Joi.object({
      user_id: Joi.number().integer().required()
    }),
  
    assignRole: Joi.object({
      id_role: Joi.number().integer().required()
    })
}

module.exports = userSchemas;

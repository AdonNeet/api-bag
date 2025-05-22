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
        email: Joi.string().min(3).optional(),
        password: Joi.string().min(6).optional()
    }),

    login: Joi.object({
        name: Joi.string().required(),
        password: Joi.string().required()
    }),

    addWorker: Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
        role_id: Joi.number().integer().required()
    }),

    updateWorker: Joi.object({
        name: Joi.string().min(3).optional(),
        email: Joi.string().min(3).optional(),
        password: Joi.string().min(6).optional(),
        role_id: Joi.number().integer().optional()
    }),

    assignRole: Joi.object({
        role_id: Joi.number().integer().required()
    })
}

module.exports = userSchemas;

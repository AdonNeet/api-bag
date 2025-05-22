const Joi = require('joi');

// ===== ROLE WORKER =====
const roleWorkerSchemas = {
  addRole: Joi.object({
    roleworker: Joi.string().required()
  }),

  editRole: Joi.object({
    roleworker: Joi.string().required()
  })
}

module.exports = roleWorkerSchemas;
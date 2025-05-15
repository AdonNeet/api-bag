const Joi = require('joi');

// ===== ROLE WORKER =====
const roleWorkerSchemas = {
  addRole: Joi.object({
    roleWorker: Joi.string().required()
  }),

  editRole: Joi.object({
    roleWorker: Joi.string().required()
  })
}

module.exports = roleWorkerSchemas;
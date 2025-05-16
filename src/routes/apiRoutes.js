/* eslint-disable no-unused-vars */
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const taskController = require('../controllers/taskController');
const orderController = require('../controllers/orderController');

const { userSchemas } = require('../validations/usersSchema');
const { roleSchemas } = require('../validations/roleSchema');
const { taskSchemas } = require('../validations/taskSchema');
const { orderSchemas } = require('../validations/orderSchema');

const failAction = (request, h, err) => {
  return h.response({ error: err.details[0].message }).code(400).takeover();
};

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      try {
        const welcomeMessage = 'Welcome to our Hartono Bag APIs';
        return h.response({ status: 'success', message: welcomeMessage }).code(200);
      } catch (error) {
        return h.response({ error: 'Failed to retrieve homepage.' }).code(500);
      }
    }
  },

  // --------------------- USERS ---------------------
  {
    method: 'POST',
    path: '/users',
    handler: userController.addUser,
    options: {
      validate: {
        payload: userSchemas.addUser,
        failAction
      }
    }
  },
  {
    method: 'PUT',
    path: '/users/{user_id}',
    handler: userController.updateUser,
    options: {
      validate: {
        payload: userSchemas.updateUser,
        failAction
      }
    }
  },
  {
    method: 'POST',
    path: '/users/login',
    handler: userController.login,
    options: {
      validate: {
        payload: userSchemas.login,
        failAction
      }
    }
  },

  {
    method: 'GET',
    path: '/users/{user_id}',
    handler: userController.getUserInfo
  },
  {
    method: 'DELETE',
    path: '/users/{user_id}',
    handler: userController.deleteUser
  },
  {
    method: 'GET',
    path: '/owners',
    handler: userController.getOwnerAll
  },
  {
    method: 'POST',
    path: '/workers',
    handler: userController.addWorker,
    options: {
      validate: {
        payload: userSchemas.addWorker,
        failAction
      }
    }
  },
  {
    method: 'PUT',
    path: '/workers/{worker_id}/role',
    handler: userController.assignRole,
    options: {
      validate: {
        payload: userSchemas.assignRole,
        failAction
      }
    }
  },
  {
    method: 'GET',
    path: '/workers',
    handler: userController.getWorkers
  },
  {
    method: 'GET',
    path: '/workers/{worker_id}',
    handler: userController.getWorkerInfo
  },

  // --------------------- ROLE WORKER ---------------------
  {
    method: 'POST',
    path: '/roles',
    handler: roleController.addRole,
    options: {
      validate: {
        payload: roleSchemas.addRole,
        failAction
      }
    }
  },
  {
    method: 'PUT',
    path: '/roles/{role_id}',
    handler: roleController.editRole,
    options: {
      validate: {
        payload: roleSchemas.editRole,
        failAction
      }
    }
  },

  // --------------------- ORDERS ---------------------
  {
    method: 'POST',
    path: '/orders',
    handler: orderController.addOrder,
    options: {
      validate: {
        payload: orderSchemas.addOrder,
        failAction
      }
    }
  },
  {
    method: 'GET',
    path: '/orders',
    handler: orderController.getOrders
  },
  {
    method: 'GET',
    path: '/orders/{order_id}',
    handler: orderController.getOrderInfo
  },
  {
    method: 'PUT',
    path: '/orders/{order_id}',
    handler: orderController.updateOrder,
    options: {
      validate: {
        payload: orderSchemas.updateOrder,
        failAction
      }
    }
  },
  {
    method: 'DELETE',
    path: '/orders/{order_id}',
    handler: orderController.deleteOrder
  },
  {
    method: 'PUT',
    path: '/orders/{order_id}/status',
    handler: orderController.updateOrderStatus,
    options: {
      validate: {
        payload: orderSchemas.updateStatus,
        failAction
      }
    }
  },
  {
    method: 'GET',
    path: '/order-status',
    handler: orderController.getOrderStatsAll
  },

  // --------------------- TASKS ---------------------
  {
    method: 'POST',
    path: '/tasks',
    handler: taskController.addTask,
    options: {
      validate: {
        payload: taskSchemas.addTask,
        failAction
      }
    }
  },
  {
    method: 'GET',
    path: '/tasks',
    handler: taskController.getTasks
  },
  {
    method: 'GET',
    path: '/tasks/order/{order_id}',
    handler: taskController.getTasksByOrder
  },
  {
    method: 'GET',
    path: '/tasks/{task_id}',
    handler: taskController.getTaskInfo
  },
  {
    method: 'PUT',
    path: '/tasks/{task_id}',
    handler: taskController.updateTask,
    options: {
      validate: {
        payload: taskSchemas.updateTask,
        failAction
      }
    }
  },
  {
    method: 'DELETE',
    path: '/tasks/{task_id}',
    handler: taskController.deleteTask
  },
  {
    method: 'GET',
    path: '/task-status',
    handler: taskController.getTaskStatsAll
  }
];

module.exports = routes;

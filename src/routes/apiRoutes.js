const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const taskController = require('../controllers/taskController');
const orderController = require('../controllers/orderController');

const { userSchemas } = require('../validations/usersSchema');
const { roleSchemas } = require('../validations/roleSchema');
const { taskSchemas } = require('../validations/taskSchema');
const { orderSchemas } = require('../validations/orderSchema');

const authMiddleware = require('../lib/middleware/authMiddleware');
const { ownerOnly, workerOnly } = require('../lib/middleware/roleMiddleware');

const failAction = (request, h, err) => {
  return h.response({ error: err.details[0].message }).code(400).takeover();
};

const routes = [
  // --------------------- HOMEPAGE ---------------------
  {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      const welcomeMessage = 'Welcome to our Hartono Bag APIs';
      return h.response({ status: 'success', message: welcomeMessage }).code(200);
    }
  },

  // --------------------- USERS ---------------------
  {
    method: 'POST',
    path: '/users',
    handler: userController.addUser,
    options: {
      validate: { payload: userSchemas.addUser, failAction }
    }
  },
  {
    method: 'PUT',
    path: '/users/{user_id}',
    handler: userController.updateUser,
    options: {
      pre: [authMiddleware],
      validate: { payload: userSchemas.updateUser, failAction }
    }
  },
  {
    method: 'POST',
    path: '/users/login',
    handler: userController.login,
    options: {
      validate: { payload: userSchemas.login, failAction }
    }
  },
  {
    method: 'GET',
    path: '/users/{user_id}',
    handler: userController.getUserInfo,
    options: {
      pre: [authMiddleware]
    }
  },
  {
    method: 'DELETE',
    path: '/users/{user_id}',
    handler: userController.deleteUser,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },
  {
    method: 'GET',
    path: '/owners',
    handler: userController.getOwnerAll,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },
  {
    method: 'POST',
    path: '/workers',
    handler: userController.addWorker,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: userSchemas.addWorker, failAction }
    }
  },
  {
    method: 'PUT',
    path: '/workers/{worker_id}/role',
    handler: userController.assignRole,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: userSchemas.assignRole, failAction }
    }
  },
  {
    method: 'GET',
    path: '/workers',
    handler: userController.getWorkers,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },
  {
    method: 'GET',
    path: '/workers/{worker_id}',
    handler: userController.getWorkerInfo,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },

  // --------------------- ROLES ---------------------
  {
    method: 'POST',
    path: '/roles',
    handler: roleController.addRole,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: roleSchemas.addRole, failAction }
    }
  },
  {
    method: 'PUT',
    path: '/roles/{role_id}',
    handler: roleController.editRole,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: roleSchemas.editRole, failAction }
    }
  },
  {
    method: 'GET',
    path: '/roles',
    handler: roleController.getRoleAll,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },
  {
    method: 'DELETE',
    path: '/roles/{role_id}',
    handler: roleController.deleteRole,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },

  // --------------------- ORDERS ---------------------
  {
    method: 'POST',
    path: '/orders',
    handler: orderController.addOrder,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: orderSchemas.addOrder, failAction }
    }
  },
  {
    method: 'GET',
    path: '/orders',
    handler: orderController.getOrders,
    options: {
      pre: [authMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/orders/{order_id}',
    handler: orderController.getOrderInfo,
    options: {
      pre: [authMiddleware]
    }
  },
  {
    method: 'PUT',
    path: '/orders/{order_id}',
    handler: orderController.updateOrder,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: orderSchemas.updateOrder, failAction }
    }
  },
  {
    method: 'DELETE',
    path: '/orders/{order_id}',
    handler: orderController.deleteOrder,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },
  {
    method: 'PUT',
    path: '/orders/{order_id}/status',
    handler: orderController.updateOrderStatus,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: orderSchemas.updateStatus, failAction }
    }
  },
  {
    method: 'GET',
    path: '/order-status',
    handler: orderController.getOrderStatsAll,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },

  // --------------------- TASKS ---------------------
  {
    method: 'POST',
    path: '/tasks',
    handler: taskController.addTask,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: taskSchemas.addTask, failAction }
    }
  },
  {
    method: 'GET',
    path: '/tasks',
    handler: taskController.getTasks,
    options: {
      pre: [authMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/tasks/order/{order_id}',
    handler: taskController.getTasksByOrder,
    options: {
      pre: [authMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/tasks/order/worker/{worker_id}',
    handler: taskController.getTasksByWorker,
    options: {
      pre: [authMiddleware, workerOnly]
    }
  },
  {
    method: 'GET',
    path: '/tasks/{task_id}',
    handler: taskController.getTaskInfo,
    options: {
      pre: [authMiddleware]
    }
  },
  {
    method: 'PUT',
    path: '/tasks/{task_id}',
    handler: taskController.updateTask,
    options: {
      pre: [authMiddleware, ownerOnly],
      validate: { payload: taskSchemas.updateTask, failAction }
    }
  },
  {
    method: 'DELETE',
    path: '/tasks/{task_id}',
    handler: taskController.deleteTask,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  },
  {
    method: 'GET',
    path: '/task-status',
    handler: taskController.getTaskStatsAll,
    options: {
      pre: [authMiddleware, ownerOnly]
    }
  }
];

module.exports = routes;

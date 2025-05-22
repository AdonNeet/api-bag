const supabase = require('../config/supabaseClient');
const { getRedisClient } = require('../config/redisClient');

const taskController = {
  // Tambah task baru
  addTask: async (request, h) => {
    const redis = await getRedisClient();

    const {
      order_id,
      worker_id,
      role_id,
      quantity,
      note,
      start_date,
      due_date
    } = request.payload;

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          order_id,
          worker_id,
          role_id,
          statustask: 'produksi', // default
          quantity,
          note,
          start_date,
          due_date
        }]);

      if (error) throw error;

      // Setelah operasi insert/update/delete berhasil
      const keys = await redis.keys('tasks:*'); // ambil semua cache task
      if (keys.length) await redis.del(keys);

      return h.response({ message: 'Task berhasil ditambahkan' }).code(201);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal menambahkan task' }).code(500);
    }
  },

  // Ambil tasks dengan pagination, urut dari task terbaru
  getTasks: async (request, h) => {  
    const redis = await getRedisClient();

    try {
      const page = parseInt(request.query.page) || 1;
      const limit = 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Cek di Redis kalo tercache
      const cacheKey = `tasks:page:${page}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return h.response(JSON.parse(cached)).code(200);
      }

      const { data, error } = await supabase
        .from('tasks_with_worker_name')
        .select(`
          task_id, 
          order_id, 
          worker_id, 
          worker_name, 
          role_id, 
          roleworker, 
          statustask, 
          quantity, 
          note, 
          start_date, 
          due_date
        `)
        .order('task_id', { ascending: false }) // urut dari task_id terbaru
        .range(from, to);

      if (error) throw error;

      const response = { page, data };
      await redis.setEx(cacheKey, 604800, JSON.stringify(response)); // selama seminggu

      return h.response(response).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal mengambil tasks' }).code(500);
    }
  },


  // Ambil semua task berdasarkan order dari VIEW
  getTasksByOrder: async (request, h) => {
    const redis = await getRedisClient();
    const { order_id } = request.params;

    try {
      const page = parseInt(request.query.page) || 1;
      const limit = 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Cek di Redis kalo tercache
      const cacheKey = `tasks:order:${order_id}:page:${page}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return h.response(JSON.parse(cached)).code(200);
      }

      const { data, error } = await supabase
        .from('tasks_with_worker_name') // ini view
        .select(`
          task_id, 
          order_id, 
          worker_id, 
          worker_name, 
          role_id, 
          roleworker, 
          statustask, 
          quantity, 
          note, 
          start_date, 
          due_date
        `)
        .eq('order_id', order_id)
        .order('task_id', { ascending: false }) // urut dari task_id terbaru
        .range(from, to);

      if (error) throw error;

      const response = { page, data };
      await redis.setEx(cacheKey, 604800, JSON.stringify(response)); // selama seminggu

      return h.response(response).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal mengambil task berdasarkan order' }).code(500);
    }
  },


  // Ambil semua task berdasarkan worker_id
  getTasksByWorker: async (request, h) => {
    const redis = await getRedisClient();
    const { worker_id } = request.params;

    try {
      const page = parseInt(request.query.page) || 1;
      const limit = 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Cek di Redis kalo tercache
      const cacheKey = `tasks:worker:${worker_id}:page:${page}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return h.response(JSON.parse(cached)).code(200);
      }

      const { data, error } = await supabase
        .from('tasks_with_worker_name') // ini view
        .select(`
          task_id, 
          order_id, 
          order_name, 
          role_id, 
          roleworker, 
          statustask, 
          quantity, 
          note, 
          start_date, 
          due_date
        `)
        .eq('worker_id', worker_id)
        .order('task_id', { ascending: false }) // urut dari task_id terbaru
        .range(from, to);

      if (error) throw error;

      const response = { page, data };
      await redis.setEx(cacheKey, 604800, JSON.stringify(response)); // selama seminggu

      return h.response(response).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal mengambil task berdasarkan worker' }).code(500);
    }
  },

  // Info task spesifik
  getTaskInfo: async (request, h) => {
    const { task_id } = request.params;

    try {
      const { data, error } = await supabase
        .from('tasks_with_worker_name')
        .select(`
          task_id, 
          order_id, 
          worker_id, 
          worker_name, 
          role_id, 
          roleworker, 
          statustask, 
          quantity, 
          note, 
          start_date, 
          due_date
        `)
        .eq('task_id', task_id)
        .single();

      if (error) throw error;

      return h.response(data).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Task tidak ditemukan' }).code(404);
    }
  },

  // Update task (note, tanggal, quantity, role)
  updateTask: async (request, h) => {
    const redis = await getRedisClient();
    const { task_id } = request.params;
    const {
      role_id,
      quantity,
      note,
      statustask,
      start_date,
      due_date
    } = request.payload;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          role_id,
          quantity,
          note,
          statustask,
          start_date,
          due_date
        })
        .eq('task_id', task_id);

      if (error) throw error;

      // Setelah operasi insert/update/delete berhasil
      const keys = await redis.keys('tasks:*'); // ambil semua cache task
      if (keys.length) await redis.del(keys);

      return h.response({ message: 'Task berhasil diperbarui' }).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal memperbarui task' }).code(500);
    }
  },

  // Hapus task
  deleteTask: async (request, h) => {
    const redis = await getRedisClient();
    const { task_id } = request.params;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', task_id);

      if (error) throw error;

      // Setelah operasi insert/update/delete berhasil
      const keys = await redis.keys('tasks:*'); // ambil semua cache task
      if (keys.length) await redis.del(keys);

      return h.response({ message: 'Task berhasil dihapus' }).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal menghapus task' }).code(500);
    }
  },

  // Ambil semua jenis status task
  getTaskStatsAll: async (_request, h) => {
    try {
      const { data, error } = await supabase
        .from('task_status')
        .select('*');

      if (error) throw error;

      return h.response(data).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal mengambil status task' }).code(500);
    }
  }
};

module.exports = taskController;
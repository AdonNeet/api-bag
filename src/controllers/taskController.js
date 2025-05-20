const supabase = require('../config/supabaseClient');

const taskController = {
  // Tambah task baru
  addTask: async (request, h) => {
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
          quantity,
          note,
          start_date,
          due_date,
          statusTask: 'produksi' // default
        }]);

      if (error) throw error;

      return h.response({ message: 'Task berhasil ditambahkan' }).code(201);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal menambahkan task' }).code(500);
    }
  },

  // Ambil semua task dari VIEW
  getTasks: async (_request, h) => {
    try {
      const { data, error } = await supabase
        .from('tasks_with_worker_name')
        .select(`
          task_id, 
          order_id, 
          worker_id, 
          worker_name, 
          role_id, 
          roleWorker, 
          statusTask, 
          quantity, 
          note, 
          start_date, 
          due_date
        `);

      if (error) throw error;

      return h.response(data).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal mengambil tasks' }).code(500);
    }
  },

  // Ambil semua task berdasarkan order dari VIEW
  getTasksByOrder: async (request, h) => {
    const { order_id } = request.params;

    try {
      const { data, error } = await supabase
        .from('tasks_with_worker_name') // ini view
        .select(`
          task_id, 
          order_id, 
          worker_id, 
          worker_name, 
          role_id, 
          roleWorker, 
          statusTask, 
          quantity, 
          note, 
          start_date, 
          due_date
        `)
        .eq('order_id', order_id);

      if (error) throw error;

      return h.response(data).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal mengambil task berdasarkan order' }).code(500);
    }
  },


  // Ambil semua task berdasarkan worker_id
  getTasksByWorker: async (request, h) => {
    const { worker_id } = request.params;

    try {
      const { data, error } = await supabase
        .from('tasks_with_worker_name') // ini view
        .select(`
          task_id, 
          order_id, 
          order_name, 
          role_id, 
          roleWorker, 
          statusTask, 
          quantity, 
          note, 
          start_date, 
          due_date
        `)
        .eq('worker_id', worker_id);

      if (error) throw error;

      return h.response(data).code(200);
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
        .from('tasks')
        .select('*')
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
    const { task_id } = request.params;
    const {
      role_id,
      quantity,
      note,
      statusTask,
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
          statusTask,
          start_date,
          due_date
        })
        .eq('task_id', task_id);

      if (error) throw error;

      return h.response({ message: 'Task berhasil diperbarui' }).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal memperbarui task' }).code(500);
    }
  },

  // Hapus task
  deleteTask: async (request, h) => {
    const { task_id } = request.params;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', task_id);

      if (error) throw error;

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
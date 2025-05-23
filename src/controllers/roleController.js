/* eslint-disable no-undef */
const supabase = require('../config/supabaseClient');

const roleController = {
  // Menambahkan role baru
  addRole: async (request, h) => {
    const { roleworker } = request.payload;

    try {
      const { error } = await supabase
        .from('role_worker')
        .insert([{ roleworker }]);

      if (error) throw error;

      return h.response({ message: 'Role berhasil ditambahkan' }).code(201);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal menambahkan role' }).code(500);
    }
  },

  // Mengedit role berdasarkan role_id
  editRole: async (request, h) => {
    const { role_id } = request.params;
    const { roleworker } = request.payload;

    try {
      const { data, error } = await supabase
        .from('role_worker')
        .update({ roleworker })
        .eq('role_id', role_id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        return h.response({ message: 'Role tidak ditemukan' }).code(404);
      }

      return h.response({ message: 'Role berhasil diperbarui' }).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal memperbarui role' }).code(500);
    }
  },

  // Mengambil semua role
  getRoleAll: async (request, h) => {
    try {
      const { data, error } = await supabase
        .from('role_worker')
        .select('*')
        .order('role_id', { ascending: true });

      if (error) throw error;

      return h.response(data).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal mengambil data role' }).code(500);
    }
  },

  // Menghapus role berdasarkan role_id
  deleteRole: async (request, h) => {
    const { role_id } = request.params;

    try {
      const { error: updateError} = await supabase
        .from("workers")
        .update({ role_id: 1 })
        .eq("role_id", role_id);

      if (updateError) throw updateError;

      const { data, error } = await supabase
        .from('role_worker')
        .delete()
        .eq('role_id', role_id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        return h.response({ message: 'Role tidak ditemukan' }).code(404);
      }

      return h.response({ message: 'Role berhasil dihapus' }).code(200);
    } catch (err) {
      console.error(err);
      return h.response({ message: 'Gagal menghapus role' }).code(500);
    }
  }
};

module.exports = roleController;

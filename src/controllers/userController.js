const supabase = require('../config/supabaseClient');
const { generateToken } = require('../lib/services/jwtService');

const userController = {
  // --------------------- USERS ---------------------
    addUser: async (request, h) => {
        const { name, email, password } = request.payload;

        const { data, error } = await supabase
        .from('Users')
        .insert({ name, email, password })
        .select();

        if (error) {
        return h.response({ status: 'fail', message: error.message }).code(400);
        }

        return h.response({ status: 'success', data: data[0] }).code(201);
    },

    updateUser: async (request, h) => {
        const { user_id } = request.params;
        const { name, email, password } = request.payload;

        const { data, error } = await supabase
        .from('Users')
        .update({ name, email, password })
        .eq('user_id', user_id)
        .select();

        if (error || data.length === 0) {
        return h.response({ status: 'fail', message: error?.message || 'User not found' }).code(404);
        }

        return h.response({ status: 'success', data: data[0] }).code(200);
    },

    login: async (request, h) => {
        const { name, password } = request.payload;

        if(name.include("@")) {
            const { data, errorA } = await supabase
                .from('Users')
                .select('*')
                .eq('email', name)
                .eq('password', password)
                .maybeSingle();

            if (errorA || !data) {
                return h.response({ status: 'fail', message: 'Invalid credentials' }).code(401);
            }

            const { check, errorB } = await supabase
                .from('owners')
                .select('*')
                .eq('owner_id', data.user_id)
                .maybeSingle()

            let role = "worker"
            if (!errorB || check) {
                role = "owner"
            } 

            const token = generateToken({
                user_id: data.user_id,
                name: data.name,
                role: role
            });

            return h.response({ status: 'success', token, user: data }).code(200);
        } else {
            const { data, errorA } = await supabase
                .from('Users')
                .select('*')
                .eq('name', name)
                .eq('password', password)
                .maybeSingle();

            if (errorA || !data) {
                return h.response({ status: 'fail', message: 'Invalid credentials' }).code(401);
            }

            const { check, errorB } = await supabase
                .from('owners')
                .select('*')
                .eq('owner_id', data.user_id)
                .maybeSingle()

            let role = "worker"
            if (!errorB || check) {
                role = "owner"
            }

            const token = generateToken({
                user_id: data.user_id,
                name: data.name,
                role: role
            });

            return h.response({ status: 'success', token }).code(200);
        }

        
    },

    getUserInfo: async (request, h) => {
        const { user_id } = request.params;

        const { data, error } = await supabase
            .from('Users')
            .select('user_id, name, email, created_at')
            .eq('user_id', user_id)
            .maybeSingle();

        if (error || !data) {
        return h.response({ status: 'fail', message: 'User not found' }).code(404);
        }

        return h.response({ status: 'success', data }).code(200);
    },

    deleteUser: async (request, h) => {
        const { user_id } = request.params;

        const { error } = await supabase
            .from('Users')
            .delete()
            .eq('user_id', user_id);

        if (error) {
        return h.response({ status: 'fail', message: error.message }).code(400);
        }

        return h.response({ status: 'success', message: 'User deleted' }).code(200);
    },

    // --------------------- OWNERS ---------------------
    getOwnerAll: async (request, h) => {
        const { data, error } = await supabase
            .from('Owners')
            .select('owner_id, user_id');

        if (error) {
        return h.response({ status: 'fail', message: error.message }).code(400);
        }

        return h.response({ status: 'success', data }).code(200);
    },

    // --------------------- WORKERS ---------------------
    addWorker: async (request, h) => {
        const { user_id } = request.payload;

        const { data, error } = await supabase
            .from('Workers')
            .insert({ user_id })
            .select();

        if (error) {
        return h.response({ status: 'fail', message: error.message }).code(400);
        }

        return h.response({ status: 'success', data: data[0] }).code(201);
    },

    assignRole: async (request, h) => {
        const { worker_id } = request.params;
        const { role_id } = request.payload;

        const { data, error } = await supabase
            .from('Workers')
            .update({ role_id })
            .eq('worker_id', worker_id)
            .select();

        if (error || data.length === 0) {
        return h.response({ status: 'fail', message: error?.message || 'Worker not found' }).code(404);
        }

        return h.response({ status: 'success', data: data[0] }).code(200);
    },

    getWorkers: async (request, h) => {
        const { data, error } = await supabase
            .from('Workers')
            .select('worker_id, user_id, role_id');

        if (error) {
        return h.response({ status: 'fail', message: error.message }).code(400);
        }

        return h.response({ status: 'success', data }).code(200);
    },

    getWorkerInfo: async (request, h) => {
        const { worker_id } = request.params;

        const { data, error } = await supabase
            .from('Workers')
            .select('worker_id, user_id, role_id')
            .eq('worker_id', worker_id)
            .maybeSingle();

        if (error || !data) {
        return h.response({ status: 'fail', message: 'Worker not found' }).code(404);
        }

        return h.response({ status: 'success', data }).code(200);
    },
};

module.exports = userController;

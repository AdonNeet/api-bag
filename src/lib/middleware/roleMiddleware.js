const ownerOnly = async (request, h) => {
  const role = request.auth.role;

  if (role !== 'owner') {
    return h.response({
      status: 'fail',
      message: 'Akses ditolak: Hanya owner yang dapat mengakses endpoint ini.'
    }).code(403).takeover();
  }

  return h.continue;
};

const workerOnly = async (request, h) => {
  const role = request.auth?.role;

  if (role !== 'worker') {
    return h.response({
      status: 'fail',
      message: 'Akses ditolak: Hanya worker yang dapat mengakses endpoint ini.'
    }).code(403).takeover();
  }

  return h.continue;
};

module.exports = {
  ownerOnly,
  workerOnly
};

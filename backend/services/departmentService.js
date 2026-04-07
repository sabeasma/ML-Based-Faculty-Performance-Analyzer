const departmentModel = require('../models/departmentModel');

function normalizeDepartmentPayload(body = {}) {
  return {
    name: body.name,
    hod: body.hod ? Number(body.hod) : null,
  };
}

async function listDepartments() {
  return departmentModel.getAllDepartments();
}

async function createDepartment(body) {
  const payload = normalizeDepartmentPayload(body);
  const id = await departmentModel.createDepartment(payload);
  const rows = await departmentModel.getAllDepartments();
  return rows.find((row) => Number(row.id) === Number(id)) || null;
}

async function updateDepartment(id, body) {
  const payload = normalizeDepartmentPayload(body);
  const updated = await departmentModel.updateDepartment(Number(id), payload);

  if (!updated) {
    return null;
  }

  const rows = await departmentModel.getAllDepartments();
  return rows.find((row) => Number(row.id) === Number(id)) || null;
}

async function removeDepartment(id) {
  return departmentModel.deleteDepartment(Number(id));
}

module.exports = {
  listDepartments,
  createDepartment,
  updateDepartment,
  removeDepartment,
};

const facultyModel = require('../models/facultyModel');

function normalizeFacultyPayload(body = {}) {
  return {
    name: body.name,
    email: body.email,
    password: body.password || 'faculty123',
    departmentId: Number(body.departmentId),
    qualification: body.qualification,
    experience: Number(body.experience || 0),
    subjectsHandled: Number(body.subjectsHandled || 0),
    studentFeedbackScore: Number(body.studentFeedbackScore || 0),
    attendancePercentage: Number(body.attendancePercentage || 0),
    researchPublications: Number(body.researchPublications || 0),
    researchImpactScore: Number(body.researchImpactScore || 0),
    mlScore: Number(body.mlScore || 0),
  };
}

async function listFaculty() {
  return facultyModel.getAllFaculty();
}

async function getFacultyById(id) {
  return facultyModel.getFacultyById(Number(id));
}

async function createFaculty(body) {
  const payload = normalizeFacultyPayload(body);
  const result = await facultyModel.createFaculty(payload);
  const created = await facultyModel.getFacultyById(result.facultyId);
  return created;
}

async function updateFaculty(id, body) {
  const payload = normalizeFacultyPayload(body);
  const updated = await facultyModel.updateFaculty(Number(id), payload);

  if (!updated) {
    return null;
  }

  return facultyModel.getFacultyById(Number(id));
}

async function removeFaculty(id) {
  return facultyModel.deleteFaculty(Number(id));
}

module.exports = {
  listFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  removeFaculty,
};

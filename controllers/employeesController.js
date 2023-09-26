const employees = require('../model/employees.json');

const createEmployee = (req, res) => {
  res.json({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
};

const deleteEmployee = (req, res) => {
  res.json({ id: req.body.id });
};

const getAllEmployees = (_req, res) => {
  res.json(employees);
};

const getEmployeeById = (req, res) => {
  if (!req?.params?.id) {
    res.json({ error: 'Enter id for employee' });
  }
  const filteredEmployee = employees.filter(emp => emp.id === req.params.id);
  res.json(filteredEmployee);
};

const updateEmployee = (req, res) => {
  res.json({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
};

module.exports = {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
};

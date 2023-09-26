const employees = require('../model/employees.json');

const data = {
  employees,
  setEmployees: function (data) {
    this.employees = data;
  },
};

const createEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees?.length
      ? data.employees[data.employees.length - 1].id + 1
      : 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!newEmployee.firstName || !newEmployee.lastName) {
    return res.status(400).json({
      message: 'First and Last names are required!',
    });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const deleteEmployee = (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.json({ error: "Required parameter 'id' was not sent in the request." });
  }

  const employee = data.employees.find(emp => emp.id === parseInt(id));

  // If the id searched doesn't exist in our DB, then employees.find() will return undefined.
  if (!employee) {
    return res.status(400).json({
      message: `Employee with id=${id} was not found!`,
    });
  }

  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(id));
  const requiredArray = [...filteredArray];

  data.setEmployees(requiredArray);

  // Send 204 status if you don't want to send data back to the client.
  //  204 — represents "No Content". More at https://www.rfc-editor.org/rfc/rfc9110.html#name-204-no-content
  res.status(200).json(data.employees);
};

const getAllEmployees = (_req, res) => {
  res.json(data.employees);
};

const getEmployeeById = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res
      .status(400)
      .json({ error: "Required parameter 'id' was not sent in the request." });
  }
  const filteredEmployee = data.employees.filter(
    emp => emp.id === parseInt(id),
  );
  res.json(filteredEmployee);
};

const updateEmployee = (req, res) => {
  const { firstName, id, lastName } = req.body;

  if (!id) {
    res.json({ error: "Required parameter 'id' was not sent in the request." });
  }

  const employee = data.employees.find(emp => emp.id === parseInt(id));

  // If the id searched doesn't exist in our DB, then employees.find() will return undefined.
  if (!employee) {
    return res.status(400).json({
      message: `Employee with id=${id} was not found!`,
    });
  }

  if (firstName) {
    employee.firstName = firstName;
  }
  if (lastName) {
    employee.lastName = lastName;
  }

  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(id));
  const unsortedArray = [...filteredArray, employee];

  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)),
  );

  res.status(200).json(data.employees);
};

module.exports = {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
};

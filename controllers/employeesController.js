const Employee = require('../model/Employee');

const createEmployee = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({
      message: 'First and Last names are required!',
    });
  }
  try {
    await Employee.create({
      firstName,
      lastName,
    });
    return res.status(201).json({
      message: `Added ${firstName} ${lastName} to 'employees' collection`,
    });
  } catch (error) {
    logEvents(
      `${error.name}: ${error.message} on ${req.method} call to ${req.url} in 'createEmployee' function`,
      'errorLogs.txt',
    );
    return res.status(500).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "Required parameter 'id' was not sent in the request body",
    });
  }

  const foundEmployee = await Employee.findOne({
    _id: id,
  }).exec();

  // If the id searched doesn't exist in our DB, then employees.find() will return undefined.
  if (!foundEmployee) {
    return res.status(400).json({
      error: `There is no employee with id = ${id}! Try again.`,
    });
  }

  await Employee.deleteOne({
    _id: id,
  });

  // Send 204 status if you don't want to send data back to the client.
  //  204 — represents "No Content". More at https://www.rfc-editor.org/rfc/rfc9110.html#name-204-no-content
  return res.status(200).json({
    message: `Deleted record of ${foundEmployee.firstName} ${foundEmployee.lastName}`,
  });
};

const getAllEmployees = async (_req, res) => {
  const employees = await Employee.find();
  if (!employees) {
    return res.status(204).json({ message: 'No employees found! ❌' });
  }
  return res.json(employees);
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "Required parameter 'id' was not sent in the request body",
    });
  }

  const foundEmployee = await Employee.findOne({
    _id: id,
  }).exec();

  if (!foundEmployee) {
    return res.status(400).json({
      error: `There is no employee with id = ${id}! Try again.`,
    });
  }

  return res.json(foundEmployee);
};

const updateEmployee = async (req, res) => {
  const { firstName, id, lastName } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "Required parameter 'id' was not sent in the request body",
    });
  }

  try {
    const foundEmployee = await Employee.findOne({
      _id: id,
    }).exec();

    // If the id searched doesn't exist in our DB, then Employee.findOne() will return undefined.
    if (!foundEmployee) {
      return res.status(400).json({
        error: `There is no employee with id = ${id}! Try again.`,
      });
    }

    if (firstName) {
      foundEmployee.firstName = firstName;
    }
    if (lastName) {
      foundEmployee.lastName = lastName;
    }

    const result = await foundEmployee.save();

    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    if (error.message.startsWith('Cast to ObjectId failed for value')) {
      return res
        .status(400)
        .json({ error: `There is no employee with id = ${id}! Try again.` });
    }
    return res.status(404).json(error);
  }
};

module.exports = {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
};

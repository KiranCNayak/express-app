const { Router } = require('express');

const {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} = require('../../controllers/employeesController');

const router = Router();

router
  .route('/')
  .get(getAllEmployees)
  .post(createEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

router.route('/:id').get(getEmployeeById);

module.exports = {
  router,
};

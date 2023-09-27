const { Router } = require('express');

const { ROLES_LIST } = require('../../config/rolesList');
const {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} = require('../../controllers/employeesController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

const router = Router();

router
  .route('/')
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), createEmployee)
  .put(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), updateEmployee)
  .delete(verifyRoles(ROLES_LIST.ADMIN), deleteEmployee); // Only Admins can delete anything from the DB

router.route('/:id').get(getEmployeeById);

module.exports = {
  router,
};

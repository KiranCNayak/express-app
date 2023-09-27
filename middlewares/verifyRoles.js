// It is a Higher Order Middleware, that takes 'allowedRoles' as an array.
// This is also an example of a function that uses Closure.
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }
    const rolesArray = [...allowedRoles];

    // Here we're checking if the 'allowedRoles' list contains
    //  this requestor's roles. If yes, next() is called, else
    //  they are not allowed to go further.
    const result = req.roles
      .map(role => rolesArray.includes(role)) // Map will compare each role in the rolesArray with current user's roles
      .find(val => Boolean(val)); // Checks if any of them has a true value, if yes that means the user is authorized to do the change

    if (!result) {
      return res.sendStatus(401);
    }

    next();
  };
};

module.exports = {
  verifyRoles,
};

const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
// TODO: Implement the /orders routes needed to make the tests pass

// Route for the base path '/orders'
router.route("/")
  .get(controller.list) // GET request to list all orders
  .post(controller.create) // POST request to create a new order
  .all(methodNotAllowed); // Catch-all for any other HTTP methods not allowed on the base path

// Route for a specific order identified by ':orderId'
router.route("/:orderId")
  .get(controller.read) // GET request to read a single order by ID
  .delete(controller.delete) // DELETE request to delete a single order by ID
  .put(controller.update) // PUT request to update a single order by ID
  .all(methodNotAllowed); // Catch-all for any other HTTP methods not allowed on the specific order path

// Export the router for use in the main application file
module.exports = router;
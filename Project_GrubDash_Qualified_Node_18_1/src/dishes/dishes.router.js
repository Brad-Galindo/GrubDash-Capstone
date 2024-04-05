// Import the express router function
const router = require("express").Router();
// Import the dishes controller which contains functions for each route
const controller = require("./dishes.controller");
// Import the methodNotAllowed middleware to handle unsupported HTTP methods
const methodNotAllowed = require("../errors/methodNotAllowed");

// Define the root route for dishes and chain route handlers for HTTP methods
router.route("/")
  .get(controller.list) // GET request to list all dishes
  .post(controller.create) // POST request to create a new dish
  .all(methodNotAllowed); // Catch-all for any other HTTP methods not allowed

// Define the route for a specific dish by its ID and chain route handlers
router.route("/:dishId")
  .get(controller.read) // GET request to read a single dish by ID
  .put(controller.update) // PUT request to update a dish by ID
  .all(methodNotAllowed); // Catch-all for any other HTTP methods not allowed

// Export the router for use in the main application file
module.exports = router;
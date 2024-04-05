const path = require("path");

// Import the orders data from the specified path
const orders = require(path.resolve("src/data/orders-data"));

// Import the function to generate the next ID for a new order
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// Middleware to check if the order ID in the request body matches the order ID in the route parameters
function orderIdMatch(req, res, next){
    const { data: { id } = {} } = req.body;
    const { orderId } = req.params;
  
    // If there is an ID in the request body and it doesn't match the route parameter, return an error
    if (id && id !== orderId) {
      return next({
        status: 400,
        message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
      });
    }
    // If there is no mismatch, proceed to the next middleware
    return next();
  }
  
// Handler to update an existing order
function updateOrder(req, res) {
    const order = res.locals.order; // The order is retrieved from the response locals, where it was stored by a previous middleware
    const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  
    // Update the order with the new details from the request body
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.dishes = dishes;
    order.status = status;
  
    // Send the updated order in the response
    res.json({ data: order });
  }

// Middleware to check if an order with the given ID exists
function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  // If the order is found, store it in the response locals and proceed
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  // If the order is not found, return an error
  next({
      status: 404,
      message: `Order id not found ${orderId}`,
  });
}

// Handler to delete an order
function deleteOrder(req, res, next) {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  
  // If the order is not found, return an error
  if (!order) {
    return next({
      status: 404,
      message: `Order id not found ${orderId}`,
    });
  }

  // If the order status is 'pending', delete the order and send a 204 No Content response
  if (order.status === "pending") {
    const index = orders.indexOf(order);
    orders.splice(index, 1);
    return res.sendStatus(204);
  }
  
  // If the order status is not 'pending', return an error
  next({
    status: 400,
    message: "An order cannot be deleted unless it is pending",
  });
}

// Middleware to validate the status of an order
function validateOrderStatus(req, res, next) {
  const { data: {status } = {} } = req.body;

  // Define the valid statuses for an order
  const validStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered'];
  // If the status is missing or empty, return an error
  if (status === undefined || status === "") {
    return next({status: 400, message: "Order must have a status"});
  }
  // If the status is 'delivered', return an error because a delivered order cannot be changed
  if (status === 'delivered') {
    return next({status: 400, message: "A delivered order cannot be changed"});
  }
  // If the status is not one of the valid statuses, return an error
  if (!validStatuses.includes(status)) {
    return next({status: 400, message: `Order must have a valid status. Received: ${status}`});
  }
  // If the status is valid, proceed to the next middleware
  next();
}

// Middleware to validate the details of an order
function validateOrder(req, res, next) {
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;

    // Check if deliverTo is provided and not empty
    if (!deliverTo || deliverTo === "") {
        return next({status: 400, message: "Order must include a deliverTo"});
    }

    // Check if mobileNumber is provided and not empty
    if (!mobileNumber || mobileNumber === "") {
        return next({status: 400, message: "Order must include a mobileNumber"});
    }

    // Check if dishes is provided
    if (!dishes) {
        return next({status: 400, message: "Order must include a dish"});
    }

    // Check if dishes is an array and contains at least one dish
    if (!Array.isArray(dishes) || dishes.length === 0) {
        return next({status: 400, message: "Order must include at least one dish"});
    }

    // Check if each dish has a valid quantity
    for(let i = 0; i < dishes.length; i++) {
        const dish = dishes[i];
        if (!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
            return next({status: 400, message: `Dish ${i} must have a quantity that is an integer greater than 0`});
        }
    }

    // If all validations pass, proceed to the next middleware
    next();
}

// Handler to create a new order
function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(), // Generate a new ID for the order
    deliverTo,
    mobileNumber,
    dishes,
  };
  orders.push(newOrder); // Add the new order to the orders array
  res.status(201).json({ data: newOrder }); // Send the new order in the response with a 201 Created status
}

// Handler to list all orders
function list(req,res) {
    res.json({data: orders});
}

// Handler to read a single order
function read(req,res) {
    res.json({data: res.locals.order}); // Send the order stored in the response locals
}

// Export the handlers as methods of the module
module.exports = {
    list,
    read: [orderExists, read],
    create: [validateOrder, create],
    delete: [deleteOrder],
    update: [orderExists,validateOrder, orderIdMatch, validateOrderStatus, updateOrder],
}
const path = require("path");

// Import the dishes data from the specified path
const dishes = require(path.resolve("src/data/dishes-data"));

// Import the function to generate the next ID for a new dish
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// Middleware to check if a dish with the given ID exists
function dishExists(req,res,next) {
    const {dishId} = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);

    // If the dish is found, store it in the response locals and proceed
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    // If the dish is not found, return an error
    next({
        status: 404,
        message: `Dish id not found ${dishId}`,
    });
}

// Middleware to validate the dish data before updating
function validateDishForUpdate(req,res,next) {
    const {dishId} = req.params;
    const {data: {id} = {}} = req.body;
 
    // If the ID in the request body does not match the route parameter, return an error
    if(id && id !== dishId) {
        return next({status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`});
    }
    // Delegate to the validateDish middleware to perform further validations
    validateDish(req,res,next);
 }
 
// Middleware to validate the dish data
function validateDish(req, res, next) {
    const {data: {name, description, price, image_url} = {}} = req.body;

    // Check if name is provided and not empty
    if (!name || name === "") {
        next({status: 400, message: "Dish must include a name"});
    // Check if description is provided and not empty
    } else if (!description || description === "") {
        next({status: 400, message: "Dish must include a description"});
    // Check if price is provided
    } else if (!price) {
        next({status: 400, message: "Dish must include a price"});
    // Check if price is greater than 0 and an integer
    } else if (price <= 0 || !Number.isInteger(price)) {
        next({status: 400, message: "Dish must have a price that is an integer greater than 0"});
    // Check if image_url is provided and not empty
    } else if (!image_url || image_url === "") {
        next({status: 400, message: "Dish must include a image_url"});
    // If all validations pass, proceed to the next middleware
    } else {
        next();
    }
}

// Handler to list all dishes
function list(req,res) {
    res.json({data: dishes});
}

// Handler to read a single dish
function read(req,res) {
    res.json({data: res.locals.dish});
}

// Handler to create a new dish
function create(req,res) {
    const {data: {name, description, price, image_url}} = req.body;
    const newDish = {
        id: nextId(), // Generate a new ID for the dish
        name,
        description,
        price,
        image_url
    }; 
    dishes.push(newDish); // Add the new dish to the dishes array
    res.status(201).json({data: newDish}); // Send the new dish in the response with a 201 Created status
}

// Handler to update an existing dish
function update(req,res) {
    const dish = res.locals.dish; // The dish is retrieved from the response locals, where it was stored by a previous middleware
    const {data: {name, description, price, image_url} = {}} = req.body;
   
    // Update the dish with the new details from the request body
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
   
    // Send the updated dish in the response
    res.json({data: dish});
 }

// Export the handlers as methods of the module
module.exports = {
    list,
    create: [validateDish, create],
    read: [dishExists, read],
    update: [dishExists, validateDishForUpdate, update],
    dishExists,
};
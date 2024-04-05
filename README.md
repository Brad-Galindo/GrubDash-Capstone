# Restaurant API

## Overview

This Restaurant API is a Node.js Express application that provides a backend for managing dishes and orders for a restaurant. It includes routes for creating, reading, updating, and deleting (CRUD) dishes and orders.

## Features

- List all dishes
- Create a new dish
- Read a single dish by ID
- Update a dish by ID
- List all orders
- Create a new order
- Read a single order by ID
- Update an order by ID
- Delete an order by ID

## Installation

To set up the Restaurant API on your local machine, follow these steps:

1. Clone the repository: git clone https://github.com/Brad-Galindo/GrubDash-Capstone
2. Navigate to the project directory: cd restaurant-api
3. 3. Install the dependencies: npm install

## Usage

To start the server, run the following command: npm start
The API will be available at `http://localhost:3000`.

## API Endpoints

### Dishes

- `GET /dishes` - Retrieve a list of all dishes.
- `POST /dishes` - Create a new dish.
- `GET /dishes/:dishId` - Retrieve a dish by its ID.
- `PUT /dishes/:dishId` - Update a dish by its ID.

### Orders

- `GET /orders` - Retrieve a list of all orders.
- `POST /orders` - Create a new order.
- `GET /orders/:orderId` - Retrieve an order by its ID.
- `PUT /orders/:orderId` - Update an order by its ID.
- `DELETE /orders/:orderId` - Delete an order by its ID.

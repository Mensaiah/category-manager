# Category Management System

This project provides an API for managing categories, including operations to add, remove, fetch, and move child categories. It's built with Node.js, Sequelize, and Joi for validation.

## Getting Started

### Prerequisites

- Node.js v14 or higher
- A running database instance (e.g., PostgreSQL, MySQL) for Sequelize ORM
- Environment variables or a `.env` file to configure your database and other settings

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mensaiah/category-manager.git
   cd category-manager
   ```
2. Install the project dependencies:
  ```bash
    yarn install
  ```

3. Set up your environment variables in a .env file in the project root or through other means:
    ```env
    NODE_ENV=development
    DATABASE_URL=your_database_url
    TEST_DATABASE_URL=your_test_database_url
    ```

### Running the App

1. To start the application in development mode:
  ```bash
    yarn run dev
  ```
2. For production, first build the app:
  ```bash
    yarn run build
  ```
Then start the production server:
  ```bash
    npm start
  ```

### Running Test
1. Before running tests, ensure you have the necessary environment variables set up for your testing database.
  ```bash
    yarn run test
  ```

### API Endpoints

- `POST /api/categories`: Add a new category
- `DELETE /api/categories/:id`: Remove a category by ID
- `GET /api/categories/subtree/:parentId`: Fetch child categories of a parent
- `PUT /api/categories/move/:id`: Move a category to a new parent


### API DOCS
[Postman Docs](https://documenter.getpostman.com/view/8107287/2s9YRDyVPC)




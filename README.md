React-Node.js-MySQL Task with JWT Authentication

Project Overview

This project is a full-stack application built with React.js for the frontend, Node.js and Express.js for the backend, and MySQL for the database. It includes user authentication using JWT tokens, a login page, a registration page, and a customer page. The frontend uses Redux Toolkit for state management and Bootstrap for styling.

Features
1. User Registration:

- Users can register with a username, email, password, and address.

- Passwords are hashed using bcrypt before storing in the database.

- Input validation is implemented on both the frontend and backend.

2. User Login:

- Users can log in with their username and password.

- On successful login, a JWT token is generated and returned to the client.

- The token is stored in sessionStorage for subsequent authenticated requests.

3. Customer Page:

- Accessible only to authenticated users.

- Requires a valid JWT token in the request header (Authorization: Bearer <token>).

4. Validation:

- Frontend validation using React Yup.

- Backend validation using Joi.

5. Security:

- Passwords are hashed using bcrypt.

- JWT tokens are used for authentication and authorization.

6. Installation & Setup
- Clone the Repository

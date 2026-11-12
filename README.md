# Gate Pass System – Backend

Node.js / Express 5 API for creating employee gate passes with executive and manager approval stages. Uses MongoDB (Mongoose) for persistence and JWT for login.

> **Security status:** This repository contains an incomplete authorization implementation. Do not deploy it to the public internet or use it for production approvals until the issues in **Security work needed** are resolved.

## Stack

- Node.js (ES modules), Express 5
- MongoDB with Mongoose
- JWT authentication, bcrypt password hashing
- dotenv, CORS

## Local setup

1. Install Node.js and run `npm install`.
2. Copy `.env.example` to `.env` and set the required values.
3. Start MongoDB or supply a reachable MongoDB connection string.
4. Run `npm start` (currently runs `nodemon index.js`).
5. API listens on `http://localhost:3000` (the port is currently hard-coded in `index.js`).

Do not commit real passwords, connection strings containing credentials, or JWT secrets.

## Endpoints

| Method | Endpoint | Current behavior |
| --- | --- | --- |
| POST | `/api/users/register` | Register an employee account |
| POST | `/api/users/login` | Log in and return a JWT |
| POST | `/api/gatepass` | Create a gate pass |
| PUT | `/api/gatepass/:id/approve/executive` | Add executive approval |
| PUT | `/api/gatepass/:id/approve/manager` | Add manager approval after an executive approval |

For protected requests, clients are intended to send `Authorization: Bearer <token>`, but **the current gate-pass routes do not enforce authentication or role permissions**. Do not assume an endpoint is protected just because a JWT is supported.

## Data model

A gate pass includes employee ID, name, department, NIC, date, time out/in, destination, reason, requestor, executive approvals, manager approval and status.

Possible statuses: `Pending`, `ExecutiveApproved`, `FullyApproved`, `Rejected`. The current implementation covers creation and approvals, not rejection.

## Security work needed

- Require verified authentication for gate-pass creation and both approval endpoints.
- Enforce server-side executive/manager role permissions and prevent self-approval where applicable.
- Do not allow public registration to choose privileged roles.
- Do not return password hashes in registration responses.
- Validate request bodies and state transitions; prevent duplicate approvals.
- Restrict CORS to approved frontend origins, introduce rate limits, and make runtime settings configurable.
- Add automated tests covering unauthorized access, role escalation and approval order.

## Current limitations

- The `test` script is a placeholder and does not run tests.
- `npm start` uses nodemon and is meant for local development.
- MongoDB connection failure handling and configuration validation need improvement.

## Repository structure

```text
controllers/   # User login/registration and gate-pass approvals
models/        # Mongoose user and gate-pass schemas
routes/        # API route definitions
index.js       # Express, MongoDB connection, JWT parsing and server
```

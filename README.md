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

Gate-pass creation now requires a verified Bearer token. Executive/manager approvals require the corresponding JWT role (or admin). This is only the initial access-control layer; see the security work below.

## Data model

A gate pass includes employee ID, name, department, NIC, date, time out/in, destination, reason, requestor, executive approvals, manager approval and status.

Possible statuses: `Pending`, `ExecutiveApproved`, `FullyApproved`, `Rejected`. The current implementation covers creation and approvals, not rejection.

## Security work needed

- Verify the existing JWT authentication and executive/manager role permissions with end-to-end tests.
- Review the proposed self-approval, approval identity and duplicate-prevention fixes in [PR #2](https://github.com/Kelumsameera/gatepass-system-backend/pull/2), which are not yet considered production-validated.
- Public registration is restricted to employee accounts and omits password hashes from its response; test these invariants.
- Validate request bodies and enforce correct approval state transitions, including concurrent updates.
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

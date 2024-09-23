# Procurement Management APIs

These are the APIs for a procurement management system.

Prioritized security by implementing measures such as JWT, Helmet, BcryptJS, CORS, DotEnv, Express Validator, HPP, Rate-Limiter, as well as implemented loggers like Morgan and Pino. Utilized MongoDB as the NoSQL Database and built the application using Express.js with Typescript for strict type checking and the project structure is fully modules based.

Managing Role Based Authentication and API access was also a key focus. Developed Auto admin creation on server start, custom middlewares to handle responses, errors, URL not found, express validations, and logging. Some app-level middlewares for HPP, Rate-Limter, and CORS. Some route-level middlewares for JWT auth. Additionally, Created separate schemas and interfaces, implemented Enums for various codes, and incorporated common functions.

## Prerequisites

Before running any of the scripts, make sure you have [Node.js](https://nodejs.org/), [TypeScript](https://www.typescriptlang.org/), and [MongoDB](https://mongodb.com/try/download/) installed on your machine.

## Available Scripts

In the project root directory, you can run:

### `npm start`

Runs the application in production mode. It executes the compiled JavaScript file located at `dist/index.js` using Node.js.

### `npm run build`

Builds the TypeScript files into JavaScript files. It transpiles the TypeScript code to JavaScript using the TypeScript compiler (`tsc`) and generates the output in the `dist` directory.

### `npm run watch`

Watches for changes in the TypeScript files and automatically rebuilds them whenever a change is detected. It's useful during development to see immediate changes without manually triggering builds.

### `npm run dev`

Runs the application in development mode. It uses `ts-node-dev` to run the TypeScript files directly without the need for compilation. It also enables hot reloading, allowing you to see changes in real-time during development.

### `ENV Variables`

```
PORT=2024
DB_URL="mongodb://localhost:27017/procurementDB"
JWT_SECRET= "8B61CBC6579DDCE9D988DF3FE5EC11EC7556C8951F4C6D91175D711514C7F1458A19F641877475AB99CC677828A57869BDCC2AC7C2ECE7EB73D47779E67562A73FA1587651B65A18DDFC82D91C6688348B864D3DBB6AE4"
ADMIN_NAME="Mukesh Karn"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="1234"
ADMIN_MOBILE=8976543210
ADMIN_NAME2="Krishna Karn"
ADMIN_EMAIL2="admin2@example.com"
ADMIN_PASSWORD2="1111"
ADMIN_MOBILE2=8976543211
```

## Additional Information

- The `prestart` script is configured to run `npm run build` before starting the application in production mode (`npm start`). This ensures that the latest changes are compiled and ready to be executed.
- Make sure to update the scripts or add additional ones as needed for your specific project requirements.

## Routes, Actions and Methods

| Methods | Routes           | Actions     |
| ------- | ---------------- | ----------- |
| POST    | /api/admin/login | Admin Login |

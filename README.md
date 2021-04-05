# Cheat-sheet maker

A fullstack application to create and share tabulated cheat sheets using markdown syntax. The backend is developed with node-JS, express-JS and mongo-db while the frontend is developed with React.

**[Checkout the website](https://cheatsheet-maker.herokuapp.com/)**.

## Features

- Browse sheets made by others
- Sheet making and editing
- Syntax highlighting with various languages
- Authentication
- Fully Responsive on mobile screens (although creating sheets is not very practical on small screens).

## Screenshots

**Home Page**

![Home page screenshot](/screenshots/home-page.png?raw=true)

**Sheet maker**

![Sheet maker screenshot](/screenshots/sheet-maker.png?raw=true)

**sheet example**

![example sheet screenshot](/screenshots/sheet.png?raw=true)

## Local testing

The project is divided into two parts, the server handles the backend and mongoDB access; and the client where the react frontend is implemented. To run the application locally, clone this repository and run `npm install` both in the main directory and in the client directory. Once the package installation is done, run `npm run dev` which will use [concurrently](https://www.npmjs.com/package/concurrently) and run/watch for modifications in the client and the server simultaneously.

### Environment variables

- After creating a mongoDB cluster, assign the connection string to the variable `dbURI` in `.env` (create the file if not already present) of the main directory.

- You will also need to assign a value for the variable `jwtSecret` in `.env` which is needed by [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme) used for generating web tokens.

## Todo

- Add rich text editor as an alternative to markdown
- More theming options
- Add search feature

## keywords

React-JS, node-JS, express, redux, react-router, mongoDB, axios, markdown.

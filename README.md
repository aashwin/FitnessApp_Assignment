# FitnessApp_Assignment
[![Build Status](https://travis-ci.com/aashwin/FitnessApp_Assignment.svg?token=QpWRxcsRng9ACRYUVjUW&branch=master)](https://travis-ci.com/aashwin/FitnessApp_Assignment)
Fitness Application built using Node.JS, AngularJS, MongoDB for an assignment at university for Application: Architectures and Frameworks

The testing suite contains two different testing methods:
First the Unit Tests that run using "npm test" run tests on the methods in the application and is dependant on the application itself. The unit tests make use of Mocha, Chai, Sinon and Chai as promised libraries.
Second there is a set of regression test that test the application via the browser. The tests are not dependant on the application code and run in the browser. It makes sure CucumberJs, Selnenium web driver and ChromeDriver.


This project is also source controlled using Git (and GitHub) and the tests and build is run continously on Travis CI.

##File Structure

- ./framework/
    - Contains framework code
        - Such as the Base Controller, Authentication and GPX Parsing Code
        - Can be taken out and plugged into an other application pretty easily
- ./node_modules/
    - Created by NPM, not part of our project, will install all npm modules here
- ./public/
    - ./app/
        - Contains all unprocessed frontend files such as:
            - Uncompressed JS, SCSS files.
            - Gulp will process these and update public/ folder
    - /assets/
        - Contains all processed frontend files such as
            - minified js & javascript libraries
            - images
            - CSS files
            - views for angular site are in static_views folder
    - ./views/
        - Contains html templates to deliver to the browser (by our node server)
- ./controllers/
    - Controllers for Express app, these controllers manage, validate and process HTTP Requests from the routes
- ./DAO/
    - Data Access Layers which speak to the database directly
- ./services/
    - Services take requests from the controller (which have already been processed a bit) and passes the request onto the DAO. They may also do some other small processing like deleting other objects that are related.
- ./models/
    - Database models
- ./routes/
    - Our routing files for express
- ./app.js
    - Main application file for our Node.js Server, will start the server.
- ./config.js
    - Configuration file, set config parameters here or via environment variables.

## Getting Started
- Requirements:
    - Node JS
    - Mongo Daemon running
- To Start:
    - In terminal, switch to the working directory (eg: cd ../FitnessApp)
    - Run command: 'npm install' - to install all modules
    - Run command: 'gulp' - To process css/js and setup the system
    - Run command: 'npm start' - To start the server.
    - To Run Unit Tests, Run command 'npm test'.
    - To Run Regression Tests, Run command 'npm run regression'.
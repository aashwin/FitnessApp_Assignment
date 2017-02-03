# FitnessApp_Assignment
Fitness Application built using Node.JS, AngularJS, MongoDB for an assignment at university for Application: Architectures and Frameworks

##File Structure
- ./app/
    - Contains all unprocessed frontend files such as:
        - Uncompressed JS, SCSS files.
        - Gulp will process these and update public/ folder
- ./framework/
    - Contains framework code
        - More info later
- ./node_modules/
    - Created by NPM, not part of our project, will install all npm modules here
- ./public/
    - /assets/
        - Contains all processed frontend files such as
            - minified js & javascript libraries
            - images
            - CSS files
            - views for angular site are in static_views folder
    - ./views/
        - Contains html templates to deliver to the browser (by our node server)
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



# Node Service Simulator

Simulates services using simple configurations via an express server and in-memory database.

## Installation

### Prerequisites
 - node.js is installed

### Configuration

<pre>npm install</pre>

Note: to set a different port (default = 4000), see app.js

## Server Start

Navigate to the directory location of the service simulator and launch the application by typing:

<pre>node app.js</pre>

Server will be listening on port 4000 on local host.

[http://localhost:4000/api/sample](http://localhost:4000/api/sample)

## Samples

Controller/Routing Logic

    service-simulator/memRoutes/data/sample.js

Data

    service-simulator/data/seedData/dev/sample.json

## Add a New Route, Controller, and Data Set

**service-simulator/memRoutes/index.js**

Add a new line to service.init that points to your new controller.

    service.contact-us = require('./data/contact-us').init(app, db, rootUrl, dataSrc, config);

**service-simulator/memRoutes/data/contact-us.js**

Add a new controller file that will contain the new routes to features logic.

*see service-simulator/memRoutes/data/sample.js for examples*

**service-simulator/data/seedData/dev/contact-us.json**

Add the json data file.

Update the controller to point to this file.

    var classes = jsonfileservice.getJsonFromFile(dataSrc + 'contact-us.json');

**service-simulator/data/seedData/dev/contact-us.json**

Restart the server 

Navigate to 

[http://localhost:4000/api/contact-us](http://localhost:4000/api/contact-us)

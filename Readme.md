Social API
==========

  This is the code example for AvenueCode Node and Express Course.

Installation
------------
`npm install`

  This will install all the dependencies and grunt-cli (the last one as a global package).

###Dependencies

  * NodeJS
  * Express
  * body-parser
  * blanket
  * bootstrap
  * cookie-parser
  * jsonwebtoken
  * Grunt
  * grunt-cli
  * grunt-contrib-copy
  * grunt-mocha-test
  * grunt-nodemon
  * Jquery
  * Jquery-Cookie
  * mocha
  * should
  * supertest
  
Run Server
----------

  To run the server you just have to execute:
  `$ grunt serverExpress`

Interacting With API
--------------------

  After you have set up the server and executed `$ grunt serverExpress`, you can access http://localhost:3000 and use
  the interface to test responses and behavior. (This code is in 'serverExpress/public/index.html').

Endpoints Available
-------------------

  * '/users/?q=_query_' - GET - List of all users or search by name using _query_
  * '/users/' - POST - Create user
  * '/users/me' - GET - Get logged user
  * '/users/:userId' - GET - Get user with given ID
  * '/users/:userId' - DELETE - Delete user with given ID
  * '/users/:userId/password' - PUT - Change user's password
  
  All endpoints are authenticated/authorized, but creating user. This endpoint is public. And the endpoint
  to delete user is authorized only to a admin.
  
Auth
----

  Authorization/Authentication is done using token, by JWT.
  
Test
----

  We are using [mocha](http://mochajs.org/), [supertest](https://github.com/visionmedia/supertest) and 
  [should](https://github.com/shouldjs/should.js) to do Unit Testing. We also added 
  [blanket](https://github.com/alex-seville/blanket) as a coverage tool
  
TO-DO
-----

  * Add Friend endpoints (https://github.com/hcbelias/socialnetwork/tree/release)
  * Implement MongoDB
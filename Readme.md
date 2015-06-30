Social API
==========

  This is the code example for AvenueCode Node and Express Course.

Installation
------------
`npm install`

  This will install all the dependencies and grunt-cli (the last one as a global package).

###Dependencies

  * [NodeJS](https://nodejs.org/)
  * [Express](https://github.com/strongloop/express)
  * [body-parser](https://github.com/expressjs/body-parser)
  * [blanket](https://github.com/alex-seville/blanket)
  * [bootstrap](https://github.com/twbs/bootstrap)
  * [cookie-parser](https://github.com/expressjs/cookie-parser)
  * [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
  * [Grunt](http://gruntjs.com/)
  * [grunt-cli](https://github.com/gruntjs/grunt-cli)
  * [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy)
  * [grunt-mocha-test](https://github.com/pghalliday/grunt-mocha-test)
  * [grunt-nodemon](https://github.com/ChrisWren/grunt-nodemon)
  * [Jquery](https://github.com/jquery/jquery)
  * [Jquery-Cookie](https://github.com/carhartl/jquery-cookie)
  * [mocha](http://mochajs.org/)
  * [should](https://github.com/shouldjs/should.js)
  * [supertest](https://github.com/visionmedia/supertest)
  
Run Server
----------

  To run the server you just have to execute:
  `$ grunt serverExpress`

Interacting With API
--------------------

  After you have set up the server and executed `$ grunt serverExpress`, you can access **http://localhost:3000** and use
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
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
  * cookie-parser
  * jsonwebtoken
  * Grunt
  * grunt-cli
  * grunt-contrib-copy
  * grunt-nodemon
  * Jquery
  * Jquery-Cookie
  
Run Server
----------

  To run the server you just have to execute:
  `$ grunt serverExpress`
  
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
  
TO-DO
-----

  * Add Friend endpoints
  * Implement MongoDB
  * Add Unit tests
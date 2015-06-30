module.exports = {
  host: 'localhost',
  port: 3000,
  secret: 'thisIsASimpleSecret123',
  issuer: 'ACode',
  cookieName:'socialAPI',
  tokenExpiration: 60*5,
  mongo: {
	  uri: 'mongodb://localhost:27017/social',
	  options: {
		  db: {
			safe: true
		  }		  
	  }
  }
};
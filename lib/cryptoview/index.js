

const CryptoViewApp = (function(app) {

  app.get('/', (req, resp, next) = {
  
  });

  app.all('/', (req, resp, next) => {
    console.log('Hello / World.');
    resp.send({hello: 'world'});
    next();
  });

  return app;
});

module.exports = CryptoViewApp


const restify = require('restify');
const path = require('path');
const corsmiddleware = require('restify-cors-middleware');

const port = process.env.port || 1337;

const app = restify.createServer({
   name: 'Administrations Panel Eksempel',
   version: '1.0.0'
});

const logger = require('morgan');
app.use(logger('dev'));

app.use(restify.plugins.acceptParser(app.acceptable));
app.use(restify.plugins.bodyParser());
app.use(restify.plugins.queryParser());

const cors = corsmiddleware({ origins: ['*'] });
app.pre(cors.preflight);
app.use(cors.actual);

require(path.join(__dirname, 'api','routes', 'index'))(app);

app.listen(port, function (err) {
   if (err) console.log(err);
   console.log('========================================================================================');
   console.log('%s is listening on port %s, address: %s', app.name, port, 'http://localhost:' + port);
});

const browserSync = require('browser-sync').create();
browserSync.watch('./public/**/*').on('change', browserSync.reload);
browserSync.init({
    'server': './public'
}); 
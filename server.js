var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static('dist'));

app.listen(app.get('port'), function() {
    console.log('Game is running on: ' + app.get('port'));
});
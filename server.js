    var express = require('express');
    var app = express();
    var path = require('path');

    app.set('port', process.env.PORT || 3000);

    app.use(express.static(path.join(__dirname, 'dist')));

    app.listen(app.get('port'), function () {
        console.log('Game is running on: ' + app.get('port'));
    });
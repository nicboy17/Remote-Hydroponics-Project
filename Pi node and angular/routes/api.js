var fs = require('fs');
var jwt = require('jsonwebtoken');

module.exports = function(router) {

    router.get('/plant', function(req, res) {
        fs.readFile('../node/data.json', function(err, content) {
            if (err) throw err;
		var parse = JSON.parse(content);
            if(parse) {
                res.json({ 'success': true, plant: parse });
            } else {
                res.json({ 'success': false });
            }
        });
    });

    router.post('/lights', function(req, res) {
        fs.readFile('../node/data.json', function(err, content) {
            if (err) throw err;
		var parse = JSON.parse(content);
            if(parse) {
                parse.lights = req.body.lights;
                fs.writeFile('../node/data.json', JSON.stringify(parse), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.json({ 'success': true });
                    }
                });
            } else {
                res.json({ 'success': false });
            }
        });
    });

    router.post('/pump', function(req, res) {
        fs.readFile('../node/data.json', function(err, content) {
            if (err) throw err;
		var parse = JSON.parse(content);
            if(parse) {
                parse.pump = req.body.pump;
                fs.writeFile('../node/data.json', JSON.stringify(parse), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.json({ 'success': true });
                    }
                });
            } else {
                res.json({ 'success': false });
            }
        });
    });

    router.post('/time', function(req, res) {
        fs.readFile('../node/data.json', function(err, content) {
            if (err) throw err;
        var parse = JSON.parse(content);
            if(parse) {
                parse.time = req.body.time;
                fs.writeFile('../node/data.json', JSON.stringify(parse), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.json({ 'success': true });
                    }
                });
            } else {
                res.json({ 'success': false });
            }
        });
    });

    return router;
}

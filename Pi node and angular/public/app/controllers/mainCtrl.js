angular.module('mainController', ['plantServices', 'mainService'])

.controller('mainCtrl', function($location, $timeout, $rootScope, $window, $interval, Plant, socket) {
	var app = this;
	app.loadme = false;
	var lights = {};
	var pump = {};
	app.cameraDisable = false;

	Plant.load().then(function(data) {
		app.temperature = data.data.plant.temperature;
		app.humidity = data.data.plant.humidity;
		app.time = data.data.plant.time;

		if(data.data.plant.lights == true) {
			app.lightOn();
		} else {
			app.lightOff();
		}

		if(data.data.plant.pump == true) {
			app.pumpOn();
		} else {
			app.pumpOff();
		}

		app.photo = "assets/images/plant.jpeg";
		app.loadme = true;
	});

	socket.on('sensor', function(msg) {
        var obj = JSON.parse(msg.payload);
        $('.' + obj.device).html(obj.value);
    });

    socket.on('camera', function(msg) {
    	console.log(msg);
        if(msg == "start") {
        	app.cameraDisable = true;
            showModal();
        } else if(msg== "end") {
        	hideModal();
        	app.cameraDisable = false;
			var t = new Date();
			app.time = t.toLocaleString();
            $('.img-thumbnail').attr("src", "assets/images/plant.jpeg");
            var time = {};
            time.time = t.toLocaleString();
            Plant.putTime(time);
        }    
    });

    var hideModal = function() {
        $("#wait").modal('hide');
    }

    var showModal = function() {
    	$("#wait").modal('show');
    }

    app.camera = function() {
    	socket.emit('camera', JSON.stringify({'camera':true}));
    }

    app.lightOn = function() {
    	$('.light-on').addClass('active');  
    	$('.light-off').removeClass('active');  
    	$('.light-off').removeClass('btn-primary');
    	$('.light-off').addClass('btn-default');
    	$('.light-on').removeClass('btn-default');
		$('.light-on').addClass('btn-primary');
		socket.emit('lights', 'lights:true');

		lights = {"lights":true};
		Plant.putLights(lights);
	}

	app.lightOff = function() {
    	$('.light-on').removeClass('active');  
    	$('.light-off').addClass('active');  
    	$('.light-off').addClass('btn-primary');
    	$('.light-off').removeClass('btn-default');
    	$('.light-on').addClass('btn-default');
		$('.light-on').removeClass('btn-primary');
		socket.emit('lights', 'lights:false');

		lights = {"lights":false};
		Plant.putLights(lights)
	}

	app.pumpOn = function() {
		$('.pump-on').addClass('active');  
    	$('.pump-off').removeClass('active');  
    	$('.pump-off').removeClass('btn-primary');
    	$('.pump-off').addClass('btn-default');
    	$('.pump-on').removeClass('btn-default');
		$('.pump-on').addClass('btn-primary');
		socket.emit('pump', 'pump:true');

		pump = {"pump":true};
		Plant.putPump(pump);
	}

	app.pumpOff = function() {
		$('.pump-on').removeClass('active');  
    	$('.pump-off').addClass('active');  
    	$('.pump-off').addClass('btn-primary');
    	$('.pump-off').removeClass('btn-default');
    	$('.pump-on').addClass('btn-default');
		$('.pump-on').removeClass('btn-primary');
		socket.emit('pump', 'pump:false');

		pump = {"pump":false};
		Plant.putPump(pump);
	}

});

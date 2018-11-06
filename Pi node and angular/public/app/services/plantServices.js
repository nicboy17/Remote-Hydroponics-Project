angular.module('plantServices', [])

.factory('Plant', function($http) {
	var plantFactory = {};

	plantFactory.load = function() {
		return $http.get('/api/plant');
	}

	plantFactory.putLights = function(lights) {
		return $http.post('/api/lights', lights);
	}

	plantFactory.putPump = function(pump) {
		return $http.post('/api/pump', pump);
	}

	plantFactory.putTime = function(time) {
		return $http.post('/api/time', time);
	}

	return plantFactory;
});

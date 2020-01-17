const request = require('request-promise-native');

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
}

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body)['ip'];
  return request('https://ipvigilante.com/' + ip);
};

const fetchISSFlyOverTimes = function(body) {
  body = JSON.parse(body).data;
  const coords = {
    "latitude": body['latitude'],
    "longitude": body['longitude']
  }
  return request('http://api.open-notify.org/iss-pass.json?lat=' + coords['latitude'] + '&lon=' + coords['longitude']);
}

module.exports = { nextISSTimesForMyLocation };
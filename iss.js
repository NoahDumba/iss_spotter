const request = require('request');

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, IP) => {
    if (error) {
      callback(error, null);
    }
    else {
      fetchCoords(IP, (error, coords) => {
        if (error) {
          callback(error, null);
        }
        else {
          fetchISSFlyOverTimes(coords, (error, flyOverTimes) => {
            if (error) {
              callback(error, null);
            }
            else {
              callback(null, flyOverTimes);
            }
          })
        }
      })
    }
  })
  
}

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      const data = JSON.parse(body);
      const ip = data['ip']
      callback(null, ip);
    }
  }
  );
};

const fetchCoords = function(IP, callback) {
  request('https://ipvigilante.com/' + IP, (error, response, body) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coords. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      const info = JSON.parse(body);
      const latLongObj = {
        "latitude": info['data']['latitude'],
        "longitude": info['data']['longitude']
      };

      callback(null, latLongObj);
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request('http://api.open-notify.org/iss-pass.json?lat=' + coords['latitude'] + '&lon=' + coords['longitude'], (error, response, body) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly-over times. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      const info = JSON.parse(body);
      const flyOverTimes = info['response'];

      callback(null, flyOverTimes);
    }
  });
};

module.exports = { fetchMyIP };
module.exports = { fetchCoords };
module.exports = { fetchISSFlyOverTimes };
module.exports = { nextISSTimesForMyLocation };
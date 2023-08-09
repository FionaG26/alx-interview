#!/usr/bin/node

const request = require('request');
const API_URL = 'https://swapi-api.hbtn.io/api';

if (process.argv.length > 2) {
  request(`${API_URL}/films/${process.argv[2]}/`, (err, _, body) => {
    if (err) {
      console.error(err);
      return;
    }

    const charactersURL = JSON.parse(body).characters;
    const charactersNamePromises = charactersURL.map(url => {
      return new Promise((resolve, reject) => {
        request(url, (promiseErr, __, charactersReqBody) => {
          if (promiseErr) {
            reject(promiseErr);
          }
          resolve(JSON.parse(charactersReqBody).name);
        });
      });
    });

    Promise.all(charactersNamePromises)
      .then(names => {
        console.log(names.join('\n'));
      })
      .catch(allErr => {
        console.error(allErr);
      });
  });
} else {
  console.error('Usage: ./script.js <Movie ID>');
}

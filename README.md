[![Build Status](https://travis-ci.com/oneEyedSunday/sendIT.svg?branch=develop)](https://travis-ci.com/oneEyedSunday/sendIT)
[![Coverage Status](https://coveralls.io/repos/github/oneEyedSunday/sendIT/badge.svg?branch=develop)](https://coveralls.io/github/oneEyedSunday/sendIT?branch=develop)

# sendIT 
SendIT is a courier service that helps users deliver parcels to different destinations. SendIT provides courier quotes based on weight categories.

# Description
SendIT is an [andela](https://www.andela.com) boot-camp project written in javascript \(ECMA 6\), the app helps users deliver parcels to different destinations. SendIT provides courier quotes based on weight categories. Destination can be changed whilst parcel is still enroute.

# Useful Links
* Pivotal Tracker Board [here](https://www.pivotaltracker.com/n/projects/2215838)
* Api Hosted [here](https://ispoa-sendit.herokuapp.com/api)
* UI teplates hosted [here](https://oneeyedsunday.github.io/sendIT/UI/index.html)
* PT Story with exported POSTMAN [here](https://www.pivotaltracker.com/story/show/162164664)

# Getting Started
## Installation
* Install [NodeJs](https://nodejs.org/en/download)
* Run `cd server` to enter server directory
* Run `npm install` or `yarn install` to install all dependencies
* Build with `npm run build-js`
* Run `npm run start` to start the server.
* Via POSTMAN or CURL send a `POST` request to `localhost:8080/api/v1/auth/login`
* The payload should contain `firstname`, `lastname`, `email` and `password` to get a token.
* Use token from above to access application via request headers

## Testing 
* While in the server directory, 
* Use `npm run test` to run tests

## Documentation
* The API endpoints are documented at 
* `localhost:8080/api-docs` if you're running server locally
* [Online docs here](https://ispoa-sendit.herokuapp.com/api-docs)

# Technologies Used
* Express
* Mocha
* Istanbul
* Babel
* EsLint
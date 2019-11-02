# Address MYSQL Node.js ANYWHERE

Have you've ever wanted to have a simple service where you can have your clients address added in simply, but also verfied? Then you have it here a docker containerized service where it will work on any machine with docker. 

## Getting Started

These instructions will use docker compose to spin up the node api, and  MySQL database on your local machine.

### Prerequisites

This has only been tested on MacOS 10.15.
Before beginning the installation, be sure you have the following software installed on the host machine:

```
- git
- Docker
```

### Installing

A step by step guide for getting the site running on your local machine.

First, clone the repo down to your local machine:

```
git clone https://github.com/jmoral1943/address-express-api
```

Next, navigate to the root of the repo in terminal run docker compose up in the root of the repo:

```
docker-compose up -d
```

Docker will then build the images and start the three services. 

```
http://localhost:3000
```
If you would like to test if you can add remove and or list you can go to postman or any way of sending http request and receiving Have fun!

```
WARNING because node might setup the db connection first before mysql start the test might fail, if they do fail wait a while longer before rerunning the test 
```
After it finishes, you can view that it is working by running a few test I made with Mocha and Chai:

```
npm test 
```
That's it!


## Built With

- [NodeJS](https://nodejs.org/en/) - Backend API's
- [MySQL](https://www.mysql.com/) - For the product database
- [Docker](https://www.docker.com) - The black magic witchcraft that pulls all of it together.
- [Mocha](https://mochajs.org/) - For api automated testing
- [Chai](https://www.chaijs.com/) - For api automated testing

## Authors

- **Jonathan Morales**  - [jmoral1943](https://github.com/jmoral1943)
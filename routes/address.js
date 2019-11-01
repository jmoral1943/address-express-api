require("dotenv").config();

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const Joi = require("@hapi/joi");
const axios = require("axios");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB,
  password: process.env.DB_PASSWORD
});

// runs a sql query that changes the default for group by policy to allow columns that have muiltple values to be used in GROUP BY
connection.execute("SET sql_mode=(SELECT REPLACE(@@sql_mode,?,?));", [
  "ONLY_FULL_GROUP_BY",
  ""
]);

// GET all addressess
router.get("/", (req, res) => {
  connection.execute("SELECT * FROM addresses", (err, results, fields) => {
    if (err) res.sendStatus(500).send("Error from the Database", err);

    res.send(results);
  });
});

// POST a new address
router.post("/", (req, res) => {
  // Joi NPM to validate the data first
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required(),
    street: Joi.string()
      .min(3)
      .required(),
    city: Joi.string()
      .min(3)
      .required(),
    state: Joi.string()
      .min(3)
      .required(),
    country: Joi.string()
      .min(3)
      .required()
  });

  const result = schema.validate(req.body);

  if (result.error) res.sendStatus(400).send(result.error.details[0].message);

  return axios
    .get("http://www.groupkt.com/country/get/all")
    .then(({ data }) => {
      let country = data.RestResponse.result.find(
        country => req.body.country.toLowerCase() === country.name.toLowerCase()
      );

      if (!country)
        throw new Error(
          "The country is not a valid country or not the entire name"
        );

      return country.alpha3_code;
    })
    // second axios request to validate the state is actually in that country
    .then(country => {
      let url = `http://www.groupkt.com/state/get/${country}/all`;
      axios
        .get(url)
        .then(({ data }) => {
          let state = data.RestResponse.result.find(
            state => req.body.state.toLowerCase() === state.name.toLowerCase()
          );

          if (!state)
            throw new Error(
              `The state is not a valid state in ${country} or you did not put the entire name`
            );

        }).then(() => {
          // preparing and executing a insert query
          
          connection.execute(
            "INSERT INTO addresses(name, street, city, state, country) VALUES(?,?,?,?,?)",
            [
              req.body.name,
              req.body.street,
              req.body.city,
              req.body.state,
              req.body.country
            ],
            (err, results, fields) => {
              // handles error if there is one
              if (err) res.sendStatus(500).send(err);
    
              res.send("id :" + results.insertId.toString());
            }
          );
        })
        .catch(err => {
          return res.status(400).send("" + err);
        });
    })
    .catch(err => {
      return res.status(400).send("" + err);
    });
});

module.exports = router;

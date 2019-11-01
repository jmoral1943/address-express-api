require("dotenv").config();

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const axios = require("axios");

const schema = require("../utils/validate");

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
  const result = schema.validate(req.body);

  if (result.error) res.sendStatus(400).send(result.error.details[0].message);

  return (
    axios
      .get("http://www.groupkt.com/country/get/all")
      .then(({ data }) => {
        let country = data.RestResponse.result.find(
          country =>
            req.body.country.toLowerCase() === country.name.toLowerCase()
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
          })
          .then(() => {
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
      })
  );
});

// UPDATE an address
router.put("/:id", (req, res) => {
  const result = schema.validate(req.body);

  if (result.error) res.sendStatus(400).send(result.error.details[0].message);

  return (
    axios
      .get("http://www.groupkt.com/country/get/all")
      .then(({ data }) => {
        let country = data.RestResponse.result.find(
          country =>
            req.body.country.toLowerCase() === country.name.toLowerCase()
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
          })
          .then(async () => {
            // preparing and executing a insert query
            // try {
            await connection.execute(
              "UPDATE addresses SET name=?, street=?, city=?, state=?, country=? WHERE address_id=?",
              [
                req.body.name,
                req.body.street,
                req.body.city,
                req.body.state,
                req.body.country,
                req.params.id
              ],
              async (err, results, fields) => {
                // handles error if there is one

                if (results.affectedRows === 0)
                  return await res
                    .status(404)
                    .send("There is no address with that Id");

                res.send("Your address is up to date!");
              }
            );
          })
          .catch(err => {
            return res.status(400).send("" + err);
          });
      })
      .catch(err => {
        return res.status(400).send("" + err);
      })
  );
});

router.delete("/:id", async (req, res) => {
  connection.execute(
    "DELETE FROM addresses WHERE address_id=?",
    [req.params.id],
    async (err, results, fields) => {
      if (results.affectedRows === 0)
        return await res.status(404).send("Ther is no address with that ID");
      res.send(`You deleted address id ${req.params.id}`);
    }
  );
});

module.exports = router;

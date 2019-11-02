require("dotenv").config();

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const schema = require("../utils/joi");
const validate = require("../utils/validate");

// MySQL connection
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
  if (req.query.country && req.query.state) {
    validate(req)
      .then(() => {
        connection.execute(
          "SELECT * FROM addresses WHERE country=? AND state=?",
          [req.query.country, req.query.state],
          (err, results, fields) => {
            res.send(results);
          }
        );
      })
      .catch(err => {
        return res.status(400).send("" + err);
      });
  } else {
    connection.execute("SELECT * FROM addresses", (err, results, fields) => {
      if (err) return res.sendStatus(500).send("Error from the Database", err);
      res.send(results);
    });
  }
});

// POST a new address
router.post("/", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  validate(req)
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
});

// UPDATE an address
router.put("/:id", (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  validate(req)
    .then(() => {
      // preparing and executing a insert query
      // try {
      connection.execute(
        "UPDATE addresses SET name=?, street=?, city=?, state=?, country=? WHERE address_id=?",
        [
          req.body.name,
          req.body.street,
          req.body.city,
          req.body.state,
          req.body.country,
          req.params.id
        ],
        (err, results, fields) => {
          // handles error if there is one

          if (results.affectedRows === 0)
            return res.status(404).send("There is no address with that Id");

          res.send("Your address is up to date!");
        }
      );
    })
    .catch(err => {
      return res.status(400).send("" + err);
    });
});

// DELETING an ID
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

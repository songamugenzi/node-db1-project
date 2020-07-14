const express = require("express");

// Database access using Knex
const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.select("*")
    .from("accounts")
    .then((accounts) => {
      res.status(200).json({ data: accounts });
    })
    .catch((error) => {
      handleError(error, res);
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("accounts")
    .where({ id })
    .first()
    .then((account) => {
      res.status(200).json({ data: account });
    })
    .catch((error) => {
      handleError(error, res);
    });
});

router.post("/", (req, res) => {
  const postData = req.body;
  // const id = req.body.params;

  if (validatePost(postData)) {
    db("accounts")
      .insert(postData, "id")
      .then((ids) => {
        db("accounts")
          .where({ id: ids[0] })
          .first()
          .then((account) => {
            res.status(201).json({ data: account });
          });
      })
      .catch((error) => {
        handleError(error, res);
      });
  } else {
    res.status(400).json({ message: "Please enter valid name and budget" });
  }
});

router.put("/:id", (req, res) => {
  const updateData = req.body;
  const { id } = req.params;

  if (validateUpdate(updateData)) {
    db("accounts")
      .where({ id })
      .update(updateData)
      .then((count) => {
        if (count > 0) {
          res.status(200).json({ data: count });
        } else {
          res
            .status(404)
            .json({ message: "Unable to retrieve account with specified ID" });
        }
      })
      .catch((error) => {
        handleError(error, res);
      });
  } else {
    res.status(400).json({ message: "Please enter valid name or budget" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("accounts")
    .where({ id })
    .del()
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ data: count });
      } else {
        res
          .status(404)
          .json({ message: "Unable to retrieve account with specified ID" });
      }
    })
    .catch((error) => {
      handleError(error, res);
    });
});

// Handlers and Validation //

function handleError(error, res) {
  console.log("error", error);
  res.status(500).json({ message: error.message });
}

function validatePost(post) {
  return Boolean(post.name && post.budget);
}

function validateUpdate(post) {
  return Boolean(post.name || post.budget);
}

module.exports = router;

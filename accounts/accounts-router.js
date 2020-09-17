const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await db("accounts");
    res.status(200).json(accounts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving accounts", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const account = await db.select("*").from("accounts").where({ id }).first();
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(400).json({ message: "Account ID not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving account", error });
  }
});

router.post("/", async (req, res) => {
  const newAccountData = req.body;

  try {
    const account = await db.insert(newAccountData).into("accounts");
    res.status(201).json(account);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding new account", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("accounts")
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count) {
        res.status(200).json({ updated: count });
      } else {
        res.status(404).json({ message: "Account ID not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error updating account", error });
    });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const count = await db.del().from("accounts").where({ id });
    count
      ? res.status(200).json({ deleted: count })
      : res.status(404).json({ message: "Account ID not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error });
  }
});

module.exports = router;

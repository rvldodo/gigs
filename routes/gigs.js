const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Gig = require("../model/Gig");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Get All gigs
router.get("/", (req, res) =>
  Gig.findAll()
    .then((gigs) => res.render("gigs", { gigs }))
    .catch((err) => console.log(err))
);

// Display add gig form
router.get("/add", (req, res) => res.render("add"));

// Add a gig
router.post("/add", (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;

  let errors = [];

  //   Validate
  if (!title) {
    errors.push({ text: "Please add a title" });
  }
  if (!technologies) {
    errors.push({ text: "Please add some technologies" });
  }
  if (!description) {
    errors.push({ text: "Please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "Please add a contact_email" });
  }

  if (errors.length > 0) {
    res.render("add", {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email,
    });
  } else {
    if (!budget) {
      budget = "Unknown";
    } else {
      budget = `$${budget}`;
    }

    // Make all technologies lower case
    technologies = technologies.toLowerCase().replace(/, /g, ",");

    // Insert the data
    Gig.create({
      title,
      technologies,
      budget,
      description,
      contact_email,
    })
      .then((data) => {
        res.redirect("/gigs");
      })
      .catch((err) => console.log(err));
  }
});

// Search for gig
router.get("/search", (req, res) => {
  let { term } = req.query;

  term = term.toLocaleLowerCase();

  Gig.findAll({ where: { technologies: { [Op.like]: "%" + term + "%" } } })
    .then((gigs) => res.render("gigs", { gigs }))
    .catch((err) => console.log(err));
});

module.exports = router;

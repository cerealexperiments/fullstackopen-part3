const express = require("express");
require("dotenv").config();
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Person = require("./models/person");

const app = express();
app.use(express.json());

const url = process.env.DATABASE_URL;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to the database");
  })
  .catch((error) => {
    console.log(`error connecting to the database\nerror: ${error.message}`);
  });

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).json({
          error: "person not found",
        });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  Person.findOne({ name: person.name }).then((foundPerson) => {
    if (foundPerson) {
      Person.findOneAndUpdate(
        { name: person.name },
        { name: person.name, number: person.number },
        {
          new: true,
        }
      )
        .then((updatedPerson) => {
          console.log(updatedPerson);
          response.json(updatedPerson);
        })
        .catch((error) => console.log(error.message));
    } else {
      person
        .save()
        .then((savedPerson) => {
          response.json(savedPerson);
        })
        .catch((error) => next(error));
    }
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

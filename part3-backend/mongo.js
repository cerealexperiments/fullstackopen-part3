const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.DATABASE_URL;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose.connect(url).then((result) => {
  console.log("connected");
  if (!process.argv[2] || !process.argv[3]) {
    console.log("phonebook:");
    Person.find({}).then((persons) => {
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      return mongoose.connection.close();
    });
  } else {
    const person = new Person({
      name: process.argv[2],
      number: process.argv[3],
    });
    person.save();
    return mongoose.connection.close();
  }
});

// mongoose
//   .connect(url)
//   .then((result) => {
//     console.log("connected");

//     const person = new Person({
//       name: "Iwakura",
//       number: "3125313412",
//     });
//     return person.save();
//   })
//   .then(() => {
//     console.log("person saved");
//     return mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// mongoose.connect(url).then((result) => {
//   console.log("connected");
//   Person.find({}).then((persons) => {
//     persons.forEach((person) => console.log(person));
//   });
//   mongoose.connection.close();
// });

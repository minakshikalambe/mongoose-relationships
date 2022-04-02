const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () => {
    return mongoose.connect(
      "mongodb://localhost:27017/library"
    );
  };

  const bookSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      Author: { type: String, required: true },
      Author2: { type: String, required: false },
      Author3: { type: String, required: false }
    },
    {
      versionKey: false,
      timestamps: true, // createdAt, updatedAt
    }
  );

  const Book = mongoose.model("book", bookSchema);


  const checkedoutSchema = new mongoose.Schema(
    {
      book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required: true,
      },
    },
    {
      versionKey: false,
      timestamps: true, // createdAt, updatedAt
    }
  );

const  Checkedout = mongoose.model(" checkedout",  checkedoutSchema);

app.get("/books", async (req, res) => {
    try {
      const books = await Book.find().lean().exec();
  
      return res.status(200).send({ books: books }); // []
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Something went wrong .. try again later" });
    }
  });

  app.post("/books", async (req, res) => {
    try {
      const book = await Book.create(req.body);
  
      return res.status(201).send(book);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  app.get("/books/:id", async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).lean().exec();
  
      return res.status(200).send(book);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  app.patch("/books/:id", async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .lean()
        .exec();
  
      return res.status(200).send(book);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  app.delete("/books/:id", async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id).lean().exec();
  
      return res.status(200).send(book);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  app.get("/checkedouts", async (req, res) => {
    try {
      const  checkedout = await  Checkedout.find().lean().exec();
  
      return res.status(200).send( checkedout);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  app.post("/checkedouts", async (req, res) => {
    try {
      const checkedout = await Checkedout.create(req.body);
  
      return res.status(201).send(checkedout);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  
  app.listen(5001, async () => {
    try {
      await connect();
    } catch (err) {
      console.log(err);
    }
  
    console.log("listening on port 5001");
  });
  
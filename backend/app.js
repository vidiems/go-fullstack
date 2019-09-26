const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content, Accept, Origin',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  );
  next();
});

mongoose
  .connect(
    'mongodb+srv://ezeemmanuel:2k1feohTkLr9CURh@fullstackassessment-jvn24.mongodb.net/test?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch((error) => {
    console.log('Unable to connect to mongoDB Atlas');
    console.error(error);
  });

app.post('/api/recipes', (req, res, next) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time,
  });

  recipe
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Recipe created successfully',
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

app.get('/api/recipes/:id', (req, res, next) => {
  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => {
      console.log('recipe', recipe);
      res.status(200).json(recipe);
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
});

app.put('/api/recipes/:id', (req, res, next) => {
  const recipe = {
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time,
  };
  Recipe.updateOne({ _id: req.params.id }, recipe)
    .then(() => {
      res.status(200).json({
        message: 'Recipe updated successfully',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

app.delete('/api/recipes/:id', (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(204).json({
        message: 'Recipe deleted',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

app.get('/api/recipes', (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

module.exports = app;

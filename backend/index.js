const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const cors = require('cors');


app.use(cors());

require('dotenv').config();

// Replace with your actual RDS details
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

app.use(bodyParser.json());

// Define a simple model
const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Sync database
sequelize.sync({ force: true }).then(() => console.log("Database & tables created!"));

// CRUD routes

// Create an item
app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  const item = await Item.create({ name, description });
  res.json(item);
});

// Read all items
app.get('/items', async (req, res) => {
  const items = await Item.findAll({
    attributes: ['id', 'name', 'description']
  });
  res.json(items);
});

// Read single item by id
app.get('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) res.json(item);
  else res.status(404).send('Item not found');
});

// Update item
app.put('/items/:id', async (req, res) => {
  const { name, description } = req.body;
  const item = await Item.findByPk(req.params.id);
  if (item) {
    item.name = name;
    item.description = description;
    await item.save();
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Delete item
app.delete('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) {
    await item.destroy();
    res.send('Item deleted');
  } else {
    res.status(404).send('Item not found');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));

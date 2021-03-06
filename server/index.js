const express = require('express');
const path = require('path');
const { port, url } = require('../config.js');

// Metrics:
require('newrelic');

const app = express();
// Do I not need to specify index.js in database?
const db = require('../database');

app.use('/item/:user', express.static(path.join(__dirname, './../public')));
app.use('/dist', express.static(path.join(__dirname, './../dist')));
/*
 *  Response needs to return an guitar object with an _id property
 *  linked to the following GET request listingId
 */
app.get('*/reviews/api/item/endpoint/:id', async (req, res) => {
  try {
    // Client API expects an object, return first object in array:
    const [guitar] = await db.findGuitar(req.params.id);
    res.send(guitar);
  } catch (error) {
    // What to do with error?
    res.status(500).end(error);
  }
});

/*
 *  Response needs to return an array of review objects with all properties
 *  Client sets its state with this array
 */
app.get('*/reviews/api/item/:guitarId/reviews', async (req, res) => {
  try {
    const reviews = await db.findMatchingReviews(req.params.guitarId);
    res.send(reviews);
  } catch (error) {
    // What to do with error?
    res.status(500).end(error);
  }
});

/*
 *  Needs to return an {name: <guitar name>} object.
 */
app.get('*/reviews/api/item/:id', async (req, res) => {
  try {
    const guitar = await db.findGuitar(req.params.id);
    res.send(guitar);
  } catch (error) {
    // What to do with error?
    res.status(500).end(error);
  }
});

app.listen(port, () => {
  console.log(`Reviews Service listening at http://${url}:${port}`);
});

const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const [Seller] = require('./schema.js');

// UNCOMMENT FOR LOCAL DEPLOYMENT
const url = 'mongodb://localhost:27017/reviewsdb';
mongoose.connect(url, { useNewUrlParser: true });

// UNCOMMENT FOR DOCKER DEPLOYMENT
// const url = 'mongodb://mongo:27017/reviewsdb';

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  db.close();
});

/*
Create a listing given an endpoint and a new product listing
*/
module.exports.postToEndpoint = function (idCount, newListing, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      callback('404');
    } else {
      const dbo = db.db('reviewsdb');
      const query = { id_count: idCount, newListing };
      dbo.collection('listings').insertOne(query, (err, result) => {
        if (err) {
          callback('404');
        } else {
          callback(null, result);
        }
        db.close();
      });
    }
  });
};

/*
  Update a seller, given a seller name and a seller object
*/
module.exports.updateSeller = async (sellerNameToUpdate, newSeller, nextInstructions) => {
  const options = {
    new: true,
    overwrite: true
  };
  try {
    const updateResults = await Seller.findOneAndUpdate({
      name: sellerNameToUpdate
    }, newSeller, options);
    nextInstructions(null, updateResults);
  } catch (err) {
    nextInstructions(err);
  }
};

/*
  DELETE all reviews for one item
*/
module.exports.deleteReviews = async (listingId, nextInstructions) => {
  let client;
  let deleteItem;
  try {
    client = await MongoClient.connect(url);
    const db = client.db('reviewsdb');
    const query = { listings: { $in: [ObjectId(listingId)] } };
    deleteItem = await db.collection('sellers').deleteOne(query);
    return nextInstructions(null, deleteItem);
  } catch (err) {
    nextInstructions(err);
  }
  if (client) {
    client.close();
  }
};

/*
  FIND Queries
*/

module.exports.getAllSellers = function (callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      callback('404');
    } else {
      const dbo = db.db('reviewsdb');
      dbo.collection('sellers').find({}).toArray((err, result) => {
        if (err) {
          callback('404');
        } else {
          callback(result);
        }
        db.close();
      });
    }
  });
};

module.exports.getAllListings = function (callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      callback('404');
    } else {
      const dbo = db.db('reviewsdb');
      dbo.collection('listings').find({}).toArray((err, result) => {
        if (err) {
          callback('404');
        } else {
          callback(result);
        }
        db.close();
      });
    }
  });
};

module.exports.getOneSeller = function (input, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err || input === 'undefined') {
      callback('404');
    } else {
      const dbo = db.db('reviewsdb');
      const query = { _id: ObjectId(input) };
      dbo.collection('sellers').findOne(query, (err, result) => {
        if (err) {
          callback('404');
        } else {
          callback(result);
        }
        db.close();
      });
    }
  });
};

/*
USED BY SERVER:
*/
module.exports.getOneListing = function (input, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err || input === 'undefined') {
      callback('404');
    } else {
      const dbo = db.db('reviewsdb');
      const query = { _id: ObjectId(input) };
      dbo.collection('listings').findOne(query, (err, result) => {
        if (err) {
          callback('404');
        } else {
          callback(result);
        }
        db.close();
      });
    }
  });
};

module.exports.getOneListingByEndpoint = function (input, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      callback('404');
    } else {
      const dbo = db.db('reviewsdb');
      const query = { id_count: input };
      dbo.collection('listings').findOne(query, (err, result) => {
        if (err) {
          callback('404');
        } else {
          callback(result);
        }
        db.close();
      });
    }
  });
};

/*
USED BY SERVER:
*/
module.exports.getSellerReviewsForListing = function (input, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err || input === 'undefined') {
      callback('404');
    } else {
      const dbo = db.db('reviewsdb');
      const query = { listings: { $in: [ObjectId(input)] } };
      dbo.collection('sellers').findOne(query, (err, result) => {
        if (err) {
          callback(err);
        } else if (result) {
          const sortedReviews = result.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
          callback(null, sortedReviews);
        } else {
          callback(null, 'Seller reviews not found');
        }
        db.close();
      });
    }
  });
};

const { MongoClient, ObjectId } = require('mongodb');

// UNCOMMENT FOR LOCAL DEPLOYMENT
const url = 'mongodb://localhost:27017/reviewsdb';

// UNCOMMENT FOR DOCKER DEPLOYMENT
// const url = 'mongodb://mongo:27017/reviewsdb';

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  db.close();
});

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
          callback(sortedReviews);
        } else {
          /*
          HAVE TO SEND NON ERROR FIRST CALLBACK FOR LEGACY CODE COMPATIBILITY
          */
          callback(null, 'Seller reviews not found');
        }
        db.close();
      });
    }
  });
};

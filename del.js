// index.js
const admin = require('firebase-admin');
const serviceAccount = require('./cd-fys3-firebase-adminsdk-qygb7-4bf648e30e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const deleteCollection = async (collectionPath, batchSize) => {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);
  
    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve, reject);
    });
  };
  
  const deleteQueryBatch = async (db, query, resolve, reject) => {
    try {
      const snapshot = await query.get();
  
      if (snapshot.size === 0) {
        resolve();
        return;
      }
  
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
  
      process.nextTick(() => {
        deleteQueryBatch(db, query, resolve, reject);
      });
    } catch (err) {
      reject(err);
    }
  };
  
  // Usage:
  const collectionPath = 'test';
  const batchSize = 500; // Adjust batch size as needed
  
  deleteCollection(collectionPath, batchSize)
    .then(() => {
      console.log('All documents successfully deleted.');
    })
    .catch((error) => {
      console.error('Error deleting documents: ', error);
    });  
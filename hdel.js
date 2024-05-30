// index.js
const admin = require('firebase-admin');
const serviceAccount = require('./cd-fys3-firebase-adminsdk-qygb7-4bf648e30e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const deleteRandomHalf = async (collectionPath) => {
    const collectionRef = db.collection(collectionPath);
  
    // Retrieve all documents
    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
      console.log('No documents found.');
      return;
    }
  
    // Get all document references
    const allDocs = snapshot.docs;
  
    // Shuffle the documents
    const shuffledDocs = allDocs.sort(() => 0.5 - Math.random());
  
    // Calculate half of the documents
    const halfCount = Math.floor(shuffledDocs.length / 2);
  
    // Get the documents to delete (first half of the shuffled list)
    const docsToDelete = shuffledDocs.slice(0, halfCount);
  
    // Batch delete
    const batchSize = 500; // Adjust batch size as needed
    for (let i = 0; i < docsToDelete.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = docsToDelete.slice(i, i + batchSize);
  
      batchDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
    }
  
    console.log(`${docsToDelete.length} documents randomly deleted.`);
  };
  
  // Usage:
  const collectionPath = 'test';
  
  deleteRandomHalf(collectionPath)
    .then(() => {
      console.log('Random half deletion completed.');
    })
    .catch((error) => {
      console.error('Error deleting documents: ', error);
    });
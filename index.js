// index.js
const admin = require('firebase-admin');
const serviceAccount = require('./cd-fys3-firebase-adminsdk-qygb7-4bf648e30e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Function to generate random float between min and max
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate random data
const generateRandomData = () => {
  return {
    ph: getRandomInt(0, 14), // pH value typically ranges from 0 to 14
    temperature: getRandomInt(0, 100), // Assuming temperature in Celsius
    turbidity: getRandomInt(0, 1000) // Assuming NTU (Nephelometric Turbidity Units)
  };
};

const uploadRandomData = async () => {
  const collectionRef = db.collection('test');

  for (let i = 0; i < 5; i++) { // Change the number of documents as needed
    const randomData = generateRandomData();
    await collectionRef.add(randomData);
    console.log(`Document ${i+1} added: `, randomData);
  }

  console.log('Random data generation complete.');
};

uploadRandomData().catch(console.error);
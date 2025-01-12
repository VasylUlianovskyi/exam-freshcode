const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'shm-chat';
const collectionName = 'messages';

(async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection
      .aggregate([
        {
          $match: {
            body: {
              $regex: /паровоз/i,
            },
          },
        },
        {
          $count: 'messageCount',
        },
      ])
      .toArray();

    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
})();

const admin = require('firebase-admin');
const serviceAccount = require('./emc003-sqe-tixcident-firebase-adminsdk-k4v4y-3d834ea3f2.json');

const FirebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://emc003-sqe-tixcident-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = FirebaseAdmin;
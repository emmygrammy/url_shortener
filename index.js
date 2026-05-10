import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes.js';

dotenv.config();
//create express app
const app = express();

//trust proxy
app.set("trust proxy", true);

//use json middleware
app.use(express.json());

//connect to db
connectDB();


//use url routes
app.use('/v1', urlRoutes);

//test ip route
app.get('/test-ip', (req, res) => {
  res.json({
    ip: req.ip,
    forwarded: req.headers['x-forwarded-for'],
  });
});



//test route
app.get('/', (req, res) => {
  res.send('Welcome TO URL Shortener API!,  API is working and running well');
});

//start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




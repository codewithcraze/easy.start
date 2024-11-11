const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
// creating instance of express.
const cors = require('cors');
app.use(cookieParser()); // for allowing cookie.

app.use(express.urlencoded({ extended: true }));
// Cross Origin Resource Sharing.
app.use(cors());

const passport = require('passport');
const { jwtStrategy } = require('./middleware/passport'); // Getting the jwtStrategy
const { handleError }  = require('./middleware/apierror');

app.get('/media/:filename', (req, res, next) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.sendFile(filePath);
    });
});


app.use(passport.initialize());
passport.use('jwt', jwtStrategy); 
// initilazing passport to use strategy.


require('dotenv').config(); 
// for security

const routes = require('./routes');
const mongoose = require('mongoose');
// access the database in a more better way.

const bodyParser = require('body-parser');
// get the data from the request.


// Connection to the database.
const port = process.env.PORT || 3002;
(async () => {
    const connection = await mongoose.connect(`mongodb://${process.env.DB_HOST}/saverfare`);
    if(connection){
        console.log('Connected to DB successfully');
    }else{
        console.log('Their is some error');
    }
    
})()

// parsing.
app.use(bodyParser.json());




app.use('/api', routes);

// Error handling.



app.use((err, req, res, next) => {
    handleError(err, res);
})

// Server Listening.
app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})

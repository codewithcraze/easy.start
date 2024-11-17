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

const configShowcase = require('./routes/setup.route');


// Route to handle the file download
app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'easy.start.json'); // Replace with the actual path of your JSON file
    res.download(filePath, 'easy.start.json', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Could not download the file.');
        }
    });
});



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
    const connection = await mongoose.connect(`${process.env.DB_HOST}`);
    if(connection){
        console.log('Connected to DB successfully');
    }else{
        console.log('Their is some error');
    }
    
})()

// parsing.
app.use(bodyParser.json());


app.use('/', configShowcase)
app.use('/api', routes);
// Error handling.

const connectWithRetry = async (retries = 5, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await mongoose.connect(`${process.env.DB_HOST}`);
            if (connection) {
                console.log('Connected to DB successfully');
                return; // Exit the function if connected
            }
        } catch (error) {
            console.log(`Connection attempt ${i + 1} failed. Retrying in ${delay / 1000} seconds...`, error);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
            } else {
                console.error('Failed to connect to the DB after maximum retries.');
            }
        }
    }
};

(async () => {
    await connectWithRetry();
})();



app.use((err, req, res, next) => {
    handleError(err, res);
})

// Server Listening.
app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})

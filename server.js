const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

//cors configuration
const corOptions = {
    origin: 'http://localhost:3000'
}

//middleware
app.use(cors(corOptions));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('dev'));

//routers
const userRouter = require('./routes/userRouter');
app.use('/users', userRouter);
const priceRouter = require('./routes/priceRouter');
app.use('/prices', priceRouter);
const serviceRouter = require('./routes/serviceRouter');
app.use('/services', serviceRouter);

//port
const PORT = process.env.PORT || 3001;

//server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
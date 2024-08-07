require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cronJobs = require('./config/cronJobs')
const transporter = require('./config/mailer')
const { URL_FRONT } = process.env;

const app = express();

//cors configuration
const corOptions = {
    origin: URL_FRONT
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
const accountRouter = require('./routes/accountRouter');
app.use('/accounts', accountRouter);
const clientRouter = require('./routes/clientRouter');
app.use('/clients', clientRouter);
const saleRouter = require('./routes/saleRouter');
app.use('/sales', saleRouter);
const sharedBoardRouter = require('./routes/sharedBoardRouter');
app.use('/sharedBoards', sharedBoardRouter);
const botsRouter = require('./routes/botsRouter');
app.use('/bots', botsRouter);

//port
const PORT = process.env.PORT || 3001;

//server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

transporter.verify()
    .then(() => console.log('Listo para enviar correos'))
    .catch((err) => console.log(err))

cronJobs.initCronJobs();
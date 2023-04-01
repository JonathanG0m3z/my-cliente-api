const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

//cors configuration
const corOptions = {
    origin: 'http://localhost:3000'
}

//middleware
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({message: "Hello world"})
});

//port
const PORT = process.env.PORT || 3001;

//server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
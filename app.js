let express = require("express");
let cookieParser = require("cookie-parser");
let indexRouter = require("./routes/index");
let apiRouter = require("./routes/api");
const apiResponse = require('./helpers/apiResponse');
const logger = require('morgan');
const cors = require('cors');

let app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use('/', indexRouter);
app.use('/api/', apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
    return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
    if (err.name === 'UnauthorizedError') {
        return apiResponse.unauthorizedResponse(res, err.message);
    }
});

module.exports = app;

const express = require('express');
const app = express();
const debug = require('./app/config/debug');
const cors = require('cors');

const validator = require('./app/middleware/validator');


const corOptions = {
    origin: 'http://localhost:8080/'
}
app.use(cors(corOptions));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// user route
const userRoute = require("./app/routes/User");
app.use("/user", userRoute);

const loginRoutes = require('./app/routes/login');
// Use the login routes
app.use(loginRoutes);

const uploadRoutes = require('./app/routes/upload');
// Use the login routes
app.use(uploadRoutes);

const documentRoutes = require("./app/routes/DocumentRoutes.js");
app.use(documentRoutes);

const authRoutes = require("./app/routes/auth.js");
app.use(authRoutes);

app.use(validator.errorHandler);

const port = 8080
const host = 'localhost'
app.listen(port, host, () => {
    debug ? console.log(`Server is running on ${host}:${port}`): '';
});
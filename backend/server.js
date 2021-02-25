const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

mongoose.connect(process.env.URL_DB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("connected to database");
        }
    }
);

PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`);
});
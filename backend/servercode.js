const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv/config");
const mongoose = require("mongoose");

//dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//Added bodyParser (Error Solution)
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Importing Routes
/*const productsRoute = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");*/

app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", "DELETE", "PATCH", "POST"],
        allowedHeaders:
            "Access-Control-Allow-Origin, Content-Type, Authorization, Origin, X-Requested-With, Accept",
    })
);

// Use Routes
/* app.use("/api/products", productsRoute);
 app.use("/api/users", userRoutes);
 app.use("/api/orders", orderRoutes);*/

app.use(express.urlencoded({ extended: false }));

PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`);
});

//db connection
const db = mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) console.log(err);
        else console.log("connected to database");
    }
);

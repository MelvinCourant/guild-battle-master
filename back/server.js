const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: ".env.local", override: true });

const userRoutes = require("./routes/user");

const app = express();

// Use to allow cross-origin requests
app.use(
    cors(
        {
            origin: [`${process.env.URL}:${process.env.PORT_FRONT}`, 'http://localhost:3000/'],
            credentials : true,
        }
    )
);

//cookies
app.use(cookieParser());
app.use(express.json());
app.use(express.text());

app.use("/", userRoutes);

const port = process.env.PORT_BACK;
const hostname = process.env.DOMAIN_NAME;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;
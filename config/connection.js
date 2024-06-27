// imports

const { connect, connection } = require("mongoose");

// creates database
const connectionString =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/studentDB";

// connects to mongoose and mongodb
connect(connectionString);

// exports
module.exports = connection;
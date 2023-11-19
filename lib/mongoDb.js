const mongoose = require("mongoose");

const connect = async () => {
    await mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB);
    const db = await mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
}

module.exports = { connect };
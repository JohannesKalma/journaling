const mongoose = require("mongoose")

const RtSchema = mongoose.Schema({
        title: String,
        description: String,
	    content: String
    },
    {
        timestamps: true,
    })

module.exports = mongoose.model("documents", RtSchema)
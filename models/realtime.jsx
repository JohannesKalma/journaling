const mongoose = require("mongoose")

const RtSchema = mongoose.Schema({
	    content: String
    },
    {
        timestamps: true,
    })

module.exports = mongoose.model("RealtimeJournal", RtSchema)
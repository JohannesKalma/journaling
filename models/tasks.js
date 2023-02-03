onst mongoose = require("mongoose")

const RtSchema = mongoose.Schema({
	    category: String,
        tasks:[{title: String,
                index: Number,
                document: String,
               }]
    },
    {
        timestamps: true,
    })

module.exports = mongoose.model("Tasks", RtSchema)

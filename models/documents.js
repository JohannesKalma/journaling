const mongoose = require("mongoose")

const RtSchema = mongoose.Schema({
        title: { type:String, required:true},
        description: String,
        author: {type: String, default:'Johannes Kalma'},
	    content: { type:String, required:true},
        docType: { type: String,
                   enum: ['recipe','document','collection'],
                   default: 'document'
                 },
        journalType: {type: String}, 
        legacy: {filename: {type: String, 
                            index: { unique: true, sparse: true }},
                 header: String
                },
    },
    {
        timestamps: true,
    })

module.exports = mongoose.model("documents", RtSchema);
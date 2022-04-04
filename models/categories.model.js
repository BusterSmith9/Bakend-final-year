const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    categoryImage: { type: String, required: true }
},
    {
        toJSON: {
            transform: function(doc, ret) {
                ret.categoryId = ret._id.toString();
                delete ret._id;
                delete ret._v
            },
        }
    }

);

module.exports = mongoose.model('Category', categorySchema);
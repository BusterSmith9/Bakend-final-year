const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  review: { type: String, required: true },
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }, 
  place: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required:true
  },
},{
  toJSON: {
      transform: function(doc, ret) {
          ret.reviewId = ret._id.toString();
          delete ret._id;
          delete ret._v
      },
  }
}
  
);

module.exports = mongoose.model('Review', reviewSchema);
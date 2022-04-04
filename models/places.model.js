const mongoose = require("mongoose");
const { Schema } = mongoose;

const placeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  placeName: { type: String, required: true },
  placeDescription: { type: String, required: true },
  placeImage: { type: String, required: true },
  recentlyAdded: {type: Boolean, default:false},
  latitude : {type:String,required:true},
  longitude : {type:String,required:true},
  totalLikes:{type:Number,required:false},
  category: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required:true
  }, 
},{
  toJSON: {
      transform: function(doc, ret) {
          ret.placeID = ret._id.toString();
          delete ret._id;
          delete ret._v
      },
  }
}
  
);

module.exports = mongoose.model('Place', placeSchema);



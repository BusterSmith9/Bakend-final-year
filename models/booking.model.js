const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  vehicleName: { type: String, required: true },
  vehicleNumber : {type:String,required:true},
  vehicleDescription: { type: String, required: true },
  vehicleImage: { type: String, required: true },
  Price : {type:String,required:true},
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  }, 
},{
  toJSON: {
      transform: function(doc, ret) {
          ret.bookingID = ret._id.toString();
          delete ret._id;
          delete ret._v
      },
  }
}
  
);

module.exports = mongoose.model('Booking', bookingSchema);
import mongoose from 'mongoose';

//create url schema
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    unique: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    
  },
  clicks: {
    type: Number,
    default: 0,
  }
},
{timestamps: true}
);

//create url model
export default mongoose.model('Url', urlSchema);
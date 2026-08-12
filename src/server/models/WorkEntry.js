import mongoose from 'mongoose';

const workEntrySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company Name is required']
  },
  toolName: {
    type: String,
    required: [true, 'Tool Name is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be greater than 0']
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [0, 'Rate must be greater than or equal to 0']
  },
  amount: {
    type: Number,
    required: true
  },
  workDate: {
    type: String,
    required: [true, 'Work date is required'],
    index: true // index for date-wise search
  }
}, {
  timestamps: true
});

const WorkEntry = mongoose.model('WorkEntry', workEntrySchema);

export default WorkEntry;

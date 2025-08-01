import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chartType: String,
  title: String,
  fields: [String],
  data: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chart', chartSchema);
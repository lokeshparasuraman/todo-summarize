import { Schema, model } from 'mongoose';

const todoSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Todo', todoSchema);
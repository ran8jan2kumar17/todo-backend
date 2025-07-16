import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URL)

const sh = mongoose.Schema({
  ur: { type: String, required: true },
  pass: { type: Number, required: true },
  todos: [{ todo: String, isDone: Boolean }],
});
const sh1 = mongoose.model('todouser', sh);
export default sh1;
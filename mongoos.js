import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // Important for MongoDB Atlas
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const sh = mongoose.Schema({
  ur: { type: String, required: true },
  pass: { type: Number, required: true },
  todos: [{ todo: String, isDone: Boolean }],
});

const sh1 = mongoose.model('todouser', sh);
export default sh1;

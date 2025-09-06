import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const sh = mongoose.Schema({
  ur: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  todos: [{ todo: String, isDone: Boolean }],
});

const sh1 = mongoose.model('todouser', sh);
export default sh1;

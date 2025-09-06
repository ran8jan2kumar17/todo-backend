import e from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import sh1 from './mongoos.js'
import cookieParser from 'cookie-parser';
import { enc, dnc } from "./ecdc.js"
import { enct, dct } from "./enctext.js"
const app = e();
const s = process.env.S_KEY;



app.use(cors({
    origin: 'https://mytodo-list-ten.vercel.app', // ✅ Use your frontend's URL
    //origin: "http://localhost:5173",
    credentials: true                              // ✅ Allow cookies
}));

app.use(cookieParser());
app.use(e.json()); // For parsing JSON bodies
app.use(e.urlencoded({ extended: true })); // For parsing URL-encoded bodies
app.use(e.text()); // To parse text/plain bodies



app.get('/', (req, res) => {
    res.send("hello");
})


function gt(ur) {
  return jwt.sign({ ur }, s, { expiresIn: "1h" });
}

function vt(t) {
  try {
    return jwt.verify(t, s);
  } catch (err) {
    return null; // invalid/expired
  }
}



app.post('/singup', async (req, res) => {
    try {
        const { ur, pass } = req.body;
        let hp = await enc(pass);
        const s = new sh1({ ur: ur, pass: hp })
        await s.save();
        res.json("done")
    } catch (error) {
        if (error.code == 11000) {
            return res.json("someone")
        } else {
            console.log(error)
        }
    }

})

app.post("/login", async (req, res) => {
    try {
        const { ur, pass } = req.body;
        const r = await sh1.findOne({ ur: ur });
        if (r == null) {
            return res.json("no");
        } else {
            let v = await dnc(pass, r.pass);
            if (!v) {
                return res.json("no pass")
            } else {
                const t = gt(ur);
                res.cookie('token', t, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000,
                    sameSite: 'none',   // 👈 Needed for Vercel + Render
                    secure: true        // 👈 Required for HTTPS (Render uses HTTPS)
                });


                return res.json("done")
            }

        }

    } catch (error) {
        console.log(error)
    }


})


app.post("/todo", async (req, res) => {
    try {
        const t = req.cookies.token;
        const v = vt(t);
        const l = req.body;
        if (l == '') {
            // console.log("")
        } else {
            let d = jwt.decode(t);
            let ur = d.ur;
            let el = await enct(l);
            let st = await sh1.where('ur').equals(ur).updateOne({ $push: { todos: { todo: el, isDone: false } } })
            if (v) {
                res.json("cookei");
            } else {
                return res.end("<h1>your not athorised</h1>")
            }
        }
    } catch (error) {
        console.log(error);
    }



})

app.get('/getTodos', async (req, res) => {
    try {
        const t = req.cookies.token;
        const v = vt(t);
        if (v) {
            let d = jwt.decode(t);
            let ur = d.ur;
            let todo = await sh1.findOne({ ur: ur }).select('todos')
            let t2 = todo.todos;
            let st = []
            for (let i = 0; i < t2.length; i++) {
                t2[i].todo = dct(t2[i].todo)
            }
            res.json(t2);

        } else {
            res.json("no")
        }
    } catch (error) {
        console.log(error);
    }


})

//handele delete
app.post('/delete', async (req, res) => {
    try {
        const t = req.cookies.token;
        const v = vt(t);
        if (v) {
            let d = jwt.decode(t);
            const { _id } = req.body;
            let ur = d.ur;
            const todoId = new mongoose.Types.ObjectId(_id);

            const result = await sh1.updateOne(
                { ur: ur },
                { $pull: { todos: { _id: todoId } } } // ✅ condition inside array
            );
            res.json("done");
        } else {

        }
    } catch (error) {
        console.log(error);
    }
})

app.post("/hup", async (req, res) => {
    try {
        const t = req.cookies.token;
        const v = vt(t);

        if (!v) return res.status(401).json("Invalid token");

        const { _id, isDone } = req.body;
        const todoId = new mongoose.Types.ObjectId(_id);
        const decoded = jwt.decode(t);
        const ur = decoded.ur;

        const result = await sh1.updateOne(
            { ur: ur, "todos._id": todoId },
            { $set: { "todos.$.isDone": !isDone } }
        );

        res.json("done");
    } catch (error) {
        console.log(error);
        res.status(500).json("Server error");
    }
});



app.listen(process.env.PORT || 8000, () => {
    console.log("run");
})
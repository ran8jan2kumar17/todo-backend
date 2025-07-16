import e from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'
import sh1 from './mongoos.js'
import cookieParser from 'cookie-parser';
const app = e();
const s = "ranjan123"

app.use(cors());
app.use(cookieParser());
app.use(e.json()); // For parsing JSON bodies
app.use(e.urlencoded({ extended: true })); // For parsing URL-encoded bodies
app.use(e.text()); // To parse text/plain bodies


app.get('/', (req, res) => {
    res.send("hello");
})


function gt(ur, pass) {
    const p = {
        ur,
        pass
    }
    return jwt.sign(p, s);
}
function vt(t) {
    if (!t) {
        throw new Error("Token not provided");
    }
    return jwt.verify(t, s);
}



app.post('https://todo-backend-e5ny.onrender.com/singup', async (req, res) => {
    try {
        const { ur, pass } = req.body;
        const r = await sh1.findOne({ pass: pass });
        if (r == null) {
            const s = new sh1({ ur: ur, pass: pass })
            s.save();
            res.json("done")
        } else {
            res.json("someone");
        }
    } catch (error) {
        console.log(error)
    }

})

app.post("https://todo-backend-e5ny.onrender.com/login", async (req, res) => {
    try {
        const { ur, pass } = req.body;
        const r = await sh1.findOne({ pass: pass });
        if (r == null) {
            return res.json("no");
        } else {
            const t = gt(ur, pass);
            res.cookie('token', t, {
                httpOnly: true,         // Prevent access from JavaScript
                maxAge: 60 * 60 * 1000, // 1 hour
                sameSite: 'lax',        // Protects against CSRF in most cases
                // secure: true,        // Only enable this in HTTPS (production)
            });
            return res.json("done")
        }

    } catch (error) {
        console.log(error)
    }


})


app.post("https://todo-backend-e5ny.onrender.com/todo", async (req, res) => {
    try {
        const t = req.cookies.token;
        const v = vt(t);
        const l = req.body;
        if (l == '') {
            // console.log("")
        } else {
            let d = jwt.decode(t);
            let ur = d.pass;
            let st = await sh1.where('pass').equals(ur).updateOne({ $push: { todos: { todo: l, isDone: false } } })
            if (v) {
                res.json("cookei");
            } else {

            }
        }
    } catch (error) {
        console.log(error);
    }



})

app.get('https://todo-backend-e5ny.onrender.com/getTodos', async (req, res) => {
    try {
        const t = req.cookies.token;
        const v = vt(t);
        if (v) {
            let d = jwt.decode(t);
            let ur = d.pass;
            let todo = await sh1.findOne({ pass: ur }).select('todos')
            res.json(todo.todos);

        } else {
            res.json("no")
        }
    } catch (error) {
        console.log(error);
    }


})

//handele delete
app.post('https://todo-backend-e5ny.onrender.com/delete', async (req, res) => {
    try {
        const t = req.cookies.token;
        const v = vt(t);
        if (v) {
            let d = jwt.decode(t);
            const dl = req.body;
            let ur = d.pass;
            let todo = await sh1.updateOne(
                { pass: ur }, // Match document
                { $pull: { todos: { todo: dl } } } // Pull item from array
            );
            res.json("done");
        } else {

        }
    } catch (error) {
        console.log(error);
    }
})

app.post("https://todo-backend-e5ny.onrender.com/hup", async (req, res) => {
  try {
    const t = req.cookies.token;
    const v = vt(t);

    if (!v) return res.status(401).json("Invalid token");

    const { _id, isDone } = req.body;
    const decoded = jwt.decode(t);
    const ur = decoded.pass;

    const result = await sh1.updateOne(
      { pass: ur, "todos._id": _id },
      { $set: { "todos.$.isDone": !isDone } }
    );

    res.json("done");
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
});



app.listen(8000, () => {
    console.log("run");
})
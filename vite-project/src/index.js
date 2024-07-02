const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var cors = require('cors')
const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express()
const PORT = 3000

app.use(express.json());
app.use(cors());


app.get('/sample-path', (req, res) => {
    res.send('This is a sample response!')
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post("/create", async (req, res) => {
    const { user, password } = req.body;

    console.log(user)
    console.log(password)

    bcrypt.hash(password, saltRounds, async function (err, hashed) {
        try {
            // Store hash in your password DB.
            await prisma.user.create({
                data: {
                    user,
                    hashedPassword: hashed
                }
            });
            console.log(hashed)
            res.status(200).json({});
        } catch (e) {
            res.status(500).json({ "error": e.message });
        }
    });
})


app.post("/login", async (req, res) => {
    const { user, password } = req.body;
    const userRecord = await prisma.user.findUnique({
        where: { user }
    });



    bcrypt.compare(password, userRecord.hashedPassword, function (err, result) {
        if (result) {
            res.status(200).json({});
        } else {
            res.status(500).json({ "error": err });
        }
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

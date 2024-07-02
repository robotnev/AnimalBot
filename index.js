const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var cors = require('cors')
const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express()
const PORT = 3000

// Define the schema for the users table
const userSchema = {
  username: {
    type: 'string',
    unique: true,
  },
  password: {
    type: 'string',
  },
};
// Create the users table in the database

app.use(express.json());
app.use(cors());

app.post("/create", async (req, res) => {
    const {user, password} = req.body;

    console.log(user)
    console.log(password)

    bcrypt.hash(password, saltRounds, async function(err, hashed) {
        try {
            // Store hash in your password DB.
            await prisma.user.create({
                data : {
                    user,
                    hashedPassword: hashed
                }
            });
            console.log(hashed)
            res.status(200).json({});
        } catch (e) {
            res.status(500).json({"error": e.message});
        }
    });
})

app.get('/', async (req, res) => {
    const { user, password } = req.query;
    if (user && password) {
        // Attempt to login
        const userRecord = await prisma.user.findUnique({
            where: { user }
        });
        bcrypt.compare(password, userRecord.hashedPassword, function(err, result) {
            if (result) {
                res.status(200).json({});
            } else {
                res.status(401).json({"error": "Invalid username or password"});
            }
        });
    } else {
        // Display sign up/login form
        res.send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Vite + React</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="vite-project/src/main.jsx"></script>
          </body>
        </html>
        `);
    }
});


app.post("/login", async (req, res) => {
    const {user, password} = req.body;
    const userRecord = await prisma.user.findUnique({
        where : { user }
    });

    bcrypt.compare(password, userRecord.hashedPassword, function(err, result) {
        if (result) {
            res.status(200).json({});
        } else {
            res.status(500).json({"error": err});
        }
    });
})

app.get('/sample-path', (req, res) => {
    res.send('This is a sample response!')
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })

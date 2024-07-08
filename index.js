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
  name: { type: 'string' },
  password: { type: 'string' },
};

app.use(express.json());
app.use(cors());

app.post("/create", async (req, res) => {
  const { name, password } = req.body;
  console.log(name, password)
  if (!name || !password) {
    return res.status(400).json({ error: "Invalid request" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a new user
  try {

    const newUser = await prisma.user.create({
      data: {
        name: name,
        password: hashedPassword
      }
    });
    console.log(newUser);
    res.status(201).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
});


app.get('/', async (req, res) => {
  const { name, password } = req.query;
  if (name && password) {
    // Attempt to login
    const userRecord = await prisma.user.findFirst({
      where: { name }
    });
    if (!userRecord) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const isValid = await bcrypt.compare(password, userRecord.password);
    if (isValid) {
      res.status(200).json({});
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } else {
    // Display sign up/login form
    res.send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
         <title>Hello</title>
        </head>
        <body>
        </body>
      </html>
    `);
  }
});

app.get('/new-page', (req, res) => {
  res.send('Welcome to the new page!');
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  // Validate and sanitize user input
  if (!name || !password) {
    return res.status(400).json({ error: "Invalid request 1" });
  }

  // Find the user record
  const userRecord = await prisma.user.findFirst({
    where: { name }
  });
  if (!userRecord) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Compare the provided password with the stored hash
  const isValid = await bcrypt.compare(password, userRecord.password);
  if (isValid) {
    res.status(200).json({ });
    //res.redirect('/new-page');
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var cors = require('cors')
const express = require('express')
const bcrypt = require('bcrypt');
const session = require('express-session');
const saltRounds = 10;
const app = express()
const PORT = 3000

// Define the schema for the users table
const userSchema = {
  name: { type: 'string' },
  password: { type: 'string' },
  categories: { type: 'array', items: { type: 'string' } }
};
// For images
app.get('/image-proxy/:imageUrl', (req, res) => {
  const imageUrl = req.params.imageUrl;
  const options = {
    url: imageUrl,
    headers: {
      'User-Agent': 'Your User Agent String',
    },
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.set('Content-Type', response.headers['content-type']);
      res.set('Content-Length', response.headers['content-length']);
      res.send(body);
    } else {
      res.status(404).send('Image not found');
    }
  });
});

app.use(session({
  secret: 'y111',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 3600000 // 1 hour
  }
}));

app.use(express.json());
app.use(cors());

app.post("/create", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const newPassword = await bcrypt.hash(password, saltRounds);
  // Create a new user
  try {

    const newUser = await prisma.user.create({
      data: {
        name: name,
        password: newPassword,
        categories: req.body.categories
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
  }
});
app.get('/profile', (req, res) => {
  // Access session data
  const user = req.session.user;
  res.send(`Welcome ${user.username}`);
});

app.get('/logout',
  (req, res) => {
    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging out');
      } else {
        res.send('Logged out');
      }
    });
  });

app.get('/checkName/:name', async (req, res) => {
  const name = req.params.name;
  const user = await prisma.user.findFirst({ where: { name } });
  res.json({ exists: user !== null });
});

app.get('/new-page', (req, res) => {
  res.send('Welcome to the new page!');
});

app.post("/getcat", async (req, res) => {
  const { name } = req.body;
  console.log(name)
  const userRecord = await prisma.user.findFirst({
    where: { name }
  });
  // Choose a random category
  const categories = userRecord.categories;
  res.status(200).json({ categories });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Validate and sanitize user input
  const userRecord = await prisma.user.findFirst({
    where: { name: username }
  });
  if (!userRecord) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  // Hash the provided password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const isValid = await bcrypt.compare(password, userRecord.password);
  console.log(isValid)
  if (isValid) {
    req.session.user = userRecord; // Store the user data in the session
    res.status(200).json({});
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

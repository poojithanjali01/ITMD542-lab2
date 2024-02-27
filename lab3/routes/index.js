const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Sample contacts data
let contacts = require('./data/contacts.json');

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/contacts', (req, res) => {
  res.sendFile(__dirname + '/views/contacts.html');
});

app.get('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  const contact = contacts.find(contact => contact.id === contactId);
  if (!contact) return res.status(404).send('Contact not found');
  res.sendFile(__dirname + '/views/contact.html');
});

app.get('/create-contact', (req, res) => {
  res.sendFile(__dirname + '/views/create-contact.html');
});

app.get('/edit-contact/:id', (req, res) => {
  const contactId = req.params.id;
  const contact = contacts.find(contact => contact.id === contactId);
  if (!contact) return res.status(404).send('Contact not found');
  res.sendFile(__dirname + '/views/edit-contact.html');
});

app.post('/contacts', (req, res) => {
  // Handle adding new contact
});

app.post('/contacts/:id', (req, res) => {
  // Handle updating contact
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

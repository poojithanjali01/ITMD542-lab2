const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// load contacts data
let contacts = require('./data/contacts.json');

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contacts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contacts.html'));
});

app.get('/contactsData', (req, res) => {
  res.json(contacts);
});

app.get('/create-contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'create-contact.html'));
});

app.get('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  const contact = contacts.find(contact => contact.id === contactId);
  if (!contact) {
    return res.status(404).send('Contact not found');
  }
  res.json(contact); // Send the contact details as JSON
});


app.get('/edit-contact/:id', (req, res) => {
  const contactId = req.params.id;
  const contact = contacts.find(contact => contact.id === contactId);
  if (!contact) {
    return res.status(404).send('Contact not found');
  }
  res.sendFile(path.join(__dirname, 'views', 'edit-contact.html'));
});

// POST route for editing a contact
app.post('/edit-contact/:id', (req, res) => {
  const contactId = req.params.id;
  const { firstName, lastName, email, notes } = req.body;
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return res.status(404).send('Contact not found');
  }
  // Update the contact details
  contacts[index] = {
    ...contacts[index],
    firstName,
    lastName,
    email,
    notes,
    updatedAt: new Date().toISOString()
  };
  saveContactsToFile();
  res.redirect('/contacts'); // Redirect to the contacts page after successful update
});


// DELETE route for deleting a contact
app.delete('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return res.status(404).send('Contact not found');
  }
  // Remove the contact from the contacts array
  contacts.splice(index, 1);
  // Save the updated contacts to the JSON file
  saveContactsToFile();
  res.sendStatus(204); // Send No Content response upon successful deletion
});

// Function to save contacts to file
function saveContactsToFile() {
  const contactsFilePath = path.join(__dirname, 'data', 'contacts.json');
  fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

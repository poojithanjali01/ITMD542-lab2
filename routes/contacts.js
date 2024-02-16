const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Sample contacts data
let contacts = require('../data/contacts.json');

// Route to get all contacts
router.get('/', (req, res) => {
  res.json(contacts);
});

// Route to get a single contact by ID
router.get('/:id', (req, res) => {
  const contactId = req.params.id;
  const contact = contacts.find(contact => contact.id === contactId);
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json(contact);
});

// Route to add a new contact
router.post('/', (req, res) => {
  const { firstName, lastName, email, notes } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'First name and last name are required' });
  }
  const newContact = {
    id: String(contacts.length + 1),
    firstName,
    lastName,
    email,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  contacts.push(newContact);
  saveContactsToFile();
  res.status(201).json(newContact);
});

// Route to update a contact by ID
router.put('/:id', (req, res) => {
  const contactId = req.params.id;
  const { firstName, lastName, email, notes } = req.body;
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex === -1) return res.status(404).json({ message: 'Contact not found' });
  contacts[contactIndex] = {
    ...contacts[contactIndex],
    firstName,
    lastName,
    email,
    notes,
    updatedAt: new Date().toISOString()
  };
  saveContactsToFile();
  res.json(contacts[contactIndex]);
});

// Route to delete a contact by ID
router.delete('/:id', (req, res) => {
  const contactId = req.params.id;
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex === -1) return res.status(404).json({ message: 'Contact not found' });
  contacts.splice(contactIndex, 1);
  saveContactsToFile();
  res.status(204).send();
});

// Function to save contacts to file
function saveContactsToFile() {
  const contactsFilePath = path.join(__dirname, '../data/contacts.json');
  fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));
}

module.exports = router;

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to SQLite database
const dbPath = path.join(__dirname, 'data', 'contacts.db');
const db = new sqlite3.Database(dbPath);

// Create contacts table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    notes TEXT,
    updatedAt TEXT
  )`);
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contacts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contacts.html'));
});

app.get('/contactsData', (req, res) => {
  db.all('SELECT * FROM contacts', (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

app.get('/create-contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'create-contact.html'));
});

app.get('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  db.get('SELECT * FROM contacts WHERE id = ?', [contactId], (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!row) {
      return res.status(404).send('Contact not found');
    }
    res.sendFile(path.join(__dirname, 'views', 'view.html')); // Render view.html for the contact
  });
});

app.get('/edit-contact/:id', (req, res) => {
  const contactId = req.params.id;
  db.get('SELECT * FROM contacts WHERE id = ?', [contactId], (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!row) {
      return res.status(404).send('Contact not found');
    }
    res.sendFile(path.join(__dirname, 'views', 'edit-contact.html')); // Send edit-contact.html for editing the contact
  });
});

// POST route for editing a contact
app.post('/edit-contact/:id', (req, res) => {
  const contactId = req.params.id;
  const { firstName, lastName, email, notes } = req.body;
  db.run(
    'UPDATE contacts SET firstName=?, lastName=?, email=?, notes=?, updatedAt=? WHERE id=?',
    [firstName, lastName, email, notes, new Date().toISOString(), contactId],
    (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.redirect('/contacts'); // Redirect to the contacts page after successful update
    }
  );
});

// POST route for creating a new contact
app.post('/contacts', (req, res) => {
  const { firstName, lastName, email, notes } = req.body;
  const newContactId = uuidv4();
  const updatedAt = new Date().toISOString();
  db.run(
    'INSERT INTO contacts (id, firstName, lastName, email, notes, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [newContactId, firstName, lastName, email, notes, updatedAt],
    (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.redirect('/contacts'); // Redirect to the contacts page after successful creation
    }
  );
});

// DELETE route for deleting a contact
app.delete('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  db.run('DELETE FROM contacts WHERE id = ?', [contactId], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.sendStatus(204);
  });
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

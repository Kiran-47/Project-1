import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// POST /create - handle form submission
app.post('/create', (req, res) => {
  // Extract & trim form data
  const firstName = (req.body.firstName || '').trim();
  const lastName = (req.body.lastName || '').trim();
  const email = (req.body.email || '').trim();
  const phone = (req.body.phone || '').trim();
  const subject = (req.body.subject || '').trim();
  const message = (req.body.message || '').trim();
  const newsletter = req.body.newsletter ? 'Yes' : 'No';
  const termsAccepted = req.body.terms === 'on' ? true : false;

  // Basic server-side validation for required fields
  if (!firstName || !lastName || !email || !subject || !message || !termsAccepted) {
    return res.status(400).send(`
      <p>❌ Missing required fields or terms not accepted.</p>
      <a href="/">Go back to the form</a>
    `);
  }

  // Prepare folder & filename
  const folderPath = path.join(__dirname, 'files');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Make a safe filename
  const safeFirst = firstName.replace(/\s+/g, '_');
  const safeLast = lastName.replace(/\s+/g, '_');
  const timestamp = Date.now();
  const fileName = path.join(folderPath, `${safeFirst}${safeLast}_${timestamp}.txt`);

  // File content
  const content = `
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message: ${message}
Subscribe to newsletter: ${newsletter}
Agreed to terms: ${termsAccepted ? 'Yes' : 'No'}
`;

  fs.writeFile(fileName, content, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Error saving your message.');
    }
    // Success confirmation page
    res.send(`
      <p>✅ Thank you, ${firstName}! Your message has been saved.</p>
      <a href="/">Back to form</a>
    `);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;


const keys = require('./credentials.json');


const spreadsheetId = '1ynYyDP8nORTYadE-Dr13AFWvW6ZDqvNdiaV6ryMWTt4'; 
const range = 'Sheet1!A1:D100'; 


const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});


app.post('/submit', async (req, res) => {
    const { name, email, age } = req.body;
  
    try {
      
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: [
            [name, email, age],
          ],
        },
      });      

      res.send(`
        <style>body {font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            height: 100vh;}
        h1{
        color: black
        }</style>
        <h1>Form Submitted Successfully</h1>
        <p>Thank you, ${name}. Your details have been submitted!</p>
        <a href="/">Go back to the form</a>
      `);
    } catch (error) {
      console.error('Error occurred while submitting data to Google Sheets:', error);
      res.status(500).send('Error while submitting data to Google Sheets');
    }
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


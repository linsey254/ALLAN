const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'obituary_platform'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Routes
app.get('/obituaries/create', (req, res) => {
    res.render('obituary_form');
});

app.post('/submit_obituary', (req, res) => {
    const { name, date_of_birth, date_of_death, content, author } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-') + '-' + date_of_death;
    const sql = 'INSERT INTO obituaries (name, date_of_birth, date_of_death, content, author, slug) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, date_of_birth, date_of_death, content, author, slug], (err, result) => {
        if (err) throw err;
        res.redirect('/obituaries/create');
    });
});

app.get('/obituaries', (req, res) => {
    const sql = 'SELECT * FROM obituaries';
    db.query(sql, (err, results) => {
        if (err) throw err;
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log('Full URL:', fullUrl); // Debugging line
        res.render('view_obituaries', { obituaries: results, url: fullUrl });
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server started on port 3000...');
});

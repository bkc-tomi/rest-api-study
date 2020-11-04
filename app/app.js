// api version
const apiVer = "v1";
// server
const express = require("express");
const app = express();
// database
const sqlite3 = require("sqlite3");
const dbPath = "db/database.sqlite3";



// Get all users
app.get(`/api/${apiVer}/users`, (req, res) => {
    const db = new sqlite3.Database(dbPath);
    db.all("SELECT * FROM users", (err, rows) => {
        res.json(rows);
    });
    db.close();
});

// Get user
app.get(`/api/${apiVer}/users/:id`, (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;
    db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
        res.json(row);
    });
    db.close();
});

// Search users match keyword
app.get(`/api/${apiVer}/search`, (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const keyword = req.query.q;
    db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
        res.json(rows);
    });
    db.close();
});

const port = process.env.PORT || 3000;

app.listen(port);

console.log("Listen on port http://localhost" + port);
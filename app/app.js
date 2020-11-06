// api version
const apiVer = "v1";
// server
const express = require("express");
const app = express();
// database
const sqlite3 = require("sqlite3");
const dbPath = "db/database.sqlite3";
// static hosting
const path = require("path");

const bodyParser = require("body-parser");
const { resolve } = require("path");
const { rejects } = require("assert");

// リクエストのボディをパースする設定
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// 静的ファイルのホスティング
app.use(express.static(path.join(__dirname, "static")));

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
        if (!row) {
            res.status(404).send({error: "Not Found!"});
        } else {
            res.status(200).json(row);
        }
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

const run = async(sql, db) => {
    return new Promise((resolve, rejects) => {
        db.run(sql, (err) => {
            if (err) {
                return rejects(err);
            } else {
                return resolve();
            }
        });
    });
}

// create new user
app.post(`/api/${apiVer}/users`, async(req, res) => {
    if (!req.body.name || req.body.name === "") {
        res.status(400).send({error: "ユーザ名が指定されていません。"});
    } else {
        const db = new sqlite3.Database(dbPath);
        
        const name = req.body.name;
        const profile = req.body.profile ? req.body.profile : "";
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";
    
        try {
            await run(
            `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,
            db,
            );
            res.status(201).send({ message: "新規ユーザを作成しました。"});
        } catch (e) {
            res.status(500).send({error: e});
        }
        
        db.close();
    }
});
    
    // update user data
app.put(`/api/${apiVer}/users/:id`, async(req, res) => {
    if (!req.body.name || req.body.name === "") {
        res.status(400).send({error: "ユーザ名が指定されていません。"});
    } else {
        const db = new sqlite3.Database(dbPath);
        const id = req.params.id;
        // 現在のユーザ情報を取得
        db.get(`SELECT * FROM users WHERE id = ${id}`, async(err, row) => {
            if (!row) {
                res.status(404).send({ error: "指定したユーザが見つかりません。"});
            } else {
                const name = req.body.name ? req.body.name : row.name;
                const profile = req.body.profile ? req.body.profile : row.profile;
                const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth;
    
                try {
                    await run(
                        `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
                        db,
                        res,
                        "ユーザ情報を更新しました。",
                    );
                    res.status(200).send({ message: "ユーザ情報を更新しました。"});
                } catch (e) {
                    res.status(500).send({ error: e});
                }

            }
        });
        db.close();
    }
});

// delete user data
app.delete(`/api/${apiVer}/users/:id`, async(req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;

    db.get(`SELECT * FROM users WHERE id = ${id}`, async(err, row) => {
        if (!row) {
            res.status(404).send({ error: "指定したユーザが見つかりません。"});
        } else {
            try {
                await run(
                    `DELETE FROM users WHERE id=${id}`,
                    db
                )
                res.status(200).send({ message: "ユーザを削除しました。"});
            } catch (e) {
                res.status(500).send({ error: e});
            }
            
        }
    });
    db.close();
});


const port = process.env.PORT || 3000;

app.listen(port);

console.log("Listen on port http://localhost:" + port);
const { MethodEnum, Endpoint, User, List, Todo } = require('./models')
const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql')
const crypto = require('crypto')

app.use(express.json());

const whitelist = ['https://idetiampol.xyz', 'https://www.idetiampol.xyz']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));

const port = process.env.PORT || 8080;

const host = "/4537/termproject/API/V1";

// Create connection
const db_connection = mysql.createConnection({
    host: "localhost",
    user: "isalabpr_termproject",
    password: "isalab05!",
    database: "isalabpr_termproject"
})

db_connection.connect();

queryPromise = (queryText, values) => {
    return new Promise((resolve, reject) => {
        db_connection.query(queryText, values, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};

app.get(host + '/endpoint', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 1;";

    const getAllEndpointsQuery = "SELECT * FROM Endpoint";

    let endpoints = [];

    try {
        await queryPromise(updateEndPoint);
        let endPointResults = await queryPromise(getAllEndpointsQuery);

        for (const result of endPointResults) {
            let endPoint = new Endpoint(result.Id, result.Url, result.Method, result.Requests);

            endpoints.push(endPoint);
        }

        res.send(JSON.stringify(endpoints));
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify(error));
    }
})

app.post(host + '/user/create', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 2;";

    const getUserQuery = "SELECT Id, Name, Password, IsAdmin FROM User WHERE Name = ?";

    const insertUserQuery = "INSERT INTO User (Name, Password, IsAdmin) VALUES(?, ?, ?)";

    const user = req.body;

    // hash the password
    hashPwd = crypto.createHash('sha1').update(user.password).digest('hex');

    if (user.name.trim().length < 3 || user.password.trim().length < 8) {
        res.status(400).send("User name or password is too short.");
    } else {
        try {
            let result = await queryPromise(getUserQuery, [user.name]);

            if (result.length > 0) {
                const error = {
                    error: "Username already exists."
                }
                res.status(409).send(JSON.stringify(error));
            } else {
                await queryPromise(updateEndPoint);
                // Insert user
                let result = await queryPromise(insertUserQuery, [user.name, hashPwd, user.isAdmin]);
                user.id = result.insertId;

                res.status(200).send(JSON.stringify(user));
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).send(JSON.stringify(error));
        }
    }
})

app.post(host + '/user/login', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 3;";

    const getUserQuery = "SELECT Id, Name, Password, IsAdmin FROM User WHERE Name = ? AND Password = ?";

    const user = req.body;

    // hash the password
    hashPwd = crypto.createHash('sha1').update(user.password).digest('hex');

    try {
        await queryPromise(updateEndPoint);
        // Insert user
        let result = await queryPromise(getUserQuery, [user.name, hashPwd]);

        if (result.length == 0) {
            const error = {
                error: "Wrong credentials."
            }
            res.status(401).send(JSON.stringify(error));
        } else {
            let verifiedUser = new User(result[0].Id, result[0].Name, user.password, result[0].IsAdmin);
            res.status(200).send(JSON.stringify(verifiedUser));
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(JSON.stringify(error));
    }
})

app.post(host + '/list', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 4;";

    const getUserQuery = "SELECT 1 FROM User WHERE Id = ?";

    const insertListQuery = "INSERT INTO List (Title, UserId) VALUES(?, ?)";

    const list = req.body;

    if (list.title.trim().length == 0 || list.userId <= 0) {
        res.status(400).send("List title is empty or user id is invalid.");
    } else {
        try {
            let result = await queryPromise(getUserQuery, [list.userId]);

            if (result.length < 1) {
                const error = {
                    error: "User does not exist."
                }
                res.status(401).send(JSON.stringify(error));
            } else {
                await queryPromise(updateEndPoint);
                // Insert list
                let result = await queryPromise(insertListQuery, [list.title, list.userId]);
                list.id = result.insertId;

                res.status(200).send(JSON.stringify(list));
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).send(JSON.stringify(error));
        }
    }
})

app.get(host + '/list/:userId', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 5;";

    const getAllListsForUserQuery = "SELECT Id, Title, UserId FROM List Where UserId = ?";

    const { userId } = req.params;

    let lists = [];

    if (!userId || userId <= 0) {
        const error = {
            error: "User id is invalid."
        }
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            await queryPromise(updateEndPoint);
            let listResults = await queryPromise(getAllListsForUserQuery, [userId]);

            for (const result of listResults) {
                let list = new List(result.Id, result.Title, result.UserId);

                lists.push(list);
            }

            res.send(JSON.stringify(lists));
        } catch (error) {
            console.log(error);
            res.send(JSON.stringify(error));
        }
    }
})

app.put(host + '/list/:id', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 6;";

    const updateListQuery = "UPDATE List SET Title = ? WHERE Id = ?;";

    const { id } = req.params;

    const list = req.body;

    if (list.title.trim().length == 0) {
        const error = {
            error: "List title is empty."
        }
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            await queryPromise(updateEndPoint);

            // Update list
            let result = await queryPromise(updateListQuery, [list.title, id]);

            if (result.affectedRows == 0) {
                const error = {
                    error: "List does not exist."
                }
                res.status(401).send(JSON.stringify(error));
            } else {
                res.sendStatus(200);
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).send(JSON.stringify(error));
        }
    }
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

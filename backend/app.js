const { MethodEnum, Endpoint, User } = require('./models')
const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql')
const crypto = require('crypto')

app.use(express.json());

var corsOptions = {
    origin: 'https://idetiampol.xyz',
    optionsSuccessStatus: 200
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


app.use('/', express.static(__dirname + '/../public'))
app.use(host, express.static(__dirname + '/../public'))

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
            let result = await queryPromise(getUserQuery, [user.name.trim]);

            if (result.length > 0) {
                res.status(409).send("Username already exists.");
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
            res.status(401).send("Wrong credentials.");
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

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

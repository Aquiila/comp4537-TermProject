const { MethodEnum, Endpoint } = require('./models')
const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql')

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
        console.log("endPointResults: ", endPointResults);

        for (const result of endPointResults) {
            console.log("inside for loop: ", result.Id);
            let endPoint = new Endpoint(result.Id, result.Url, result.Method, result.Requests);

            endpoints.push(endPoint);
        }

        console.log("endpoints", endpoints);
        res.send(JSON.stringify(endpoints));
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify(error));
    }
})

app.post(host + '/user/create', async (req, res) => {

    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 2;";

    const insertUserQuery = "INSERT INTO User (Name, Password, IsAdmin) VALUES(?, ?, ?)";

    const user = req.body;

    // TODO: hash the password
    try {
        await queryPromise(updateEndPoint);
        // Insert user
        let result = await queryPromise(insertUserQuery, [user.name, user.password, user.isAdmin]);
        user.id = result.insertId;

        res.send(JSON.stringify(user));
    }
    catch (error) {
        res.status(500).send(JSON.stringify(error));
    }

})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

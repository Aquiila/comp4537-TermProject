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

/**
 * ENDPOINTS
 */

/**
 * Statistics
 */
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

/**
 * User Account
 */
// Create a new account
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

// Verify user on login
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

/**
 * Lists
 */
// Create new list
app.post(host + '/list', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 4;";

    const getUserQuery = "SELECT 1 FROM User WHERE Id = ?";

    const insertListQuery = "INSERT INTO List (Title, UserId) VALUES(?, ?)";

    const list = req.body;

    if (list.title.trim().length == 0 || list.userId <= 0) {
        const error = {
            error: "List title is empty or user id is invalid."
        }
        res.status(400).send(JSON.stringify(list));
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

// Get all lists for a user
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

// Rename a list
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
                res.status(400).send(JSON.stringify(error));
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

// Delete a list
app.delete(host + '/list/:id', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 7;";

    const deleteListQuery = "DELETE FROM List WHERE Id = ?;";

    const { id } = req.params;
    try {
        await queryPromise(updateEndPoint);

        // Delete list
        let result = await queryPromise(deleteListQuery, [id]);

        if (result.affectedRows == 0) {
            const error = {
                error: "List does not exist."
            }
            res.status(400).send(JSON.stringify(error));
        } else {
            res.sendStatus(200);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(JSON.stringify(error));
    }
})

/**
 * "Todos"
 */
// Create new todo
app.post(host + '/todo/:listId', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 8;";

    const getListQuery = "SELECT 1 FROM List WHERE Id = ?";

    const insertTodoQuery = "INSERT INTO Todo (Title, ListId) VALUES(?, ?)";

    const todo = req.body;

    const { listId } = req.params;

    if (todo.title.trim().length == 0) {
        const error = {
            error: "Todo title is empty."
        }
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            let result = await queryPromise(getListQuery, [listId]);

            if (result.length < 1) {
                const error = {
                    error: "List does not exist."
                }
                res.status(400).send(JSON.stringify(error));
            } else {
                await queryPromise(updateEndPoint);
                // Insert todo
                let result = await queryPromise(insertTodoQuery, [todo.title, listId]);
                todo.id = result.insertId;

                res.status(200).send(JSON.stringify(todo));
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).send(JSON.stringify(error));
        }
    }
})

// Get all todos for a list
app.get(host + '/todo/:listId', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 9;";

    const getAllTodosForListQuery = "SELECT Id, Title, ListId, Completed FROM Todo Where ListId = ?";

    const { listId } = req.params;

    let todos = [];

    if (!listId || listId <= 0) {
        const error = {
            error: "List id is invalid."
        }
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            await queryPromise(updateEndPoint);
            let todoResults = await queryPromise(getAllTodosForListQuery, [listId]);

            for (const result of todoResults) {
                let todo = new Todo(result.Id, result.Title, result.ListId, result.Completed);

                todos.push(todo);
            }

            res.send(JSON.stringify(todos));
        } catch (error) {
            console.log(error);
            res.send(JSON.stringify(error));
        }
    }
})

// Set completed flag for todo
app.put(host + '/todo/:id', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 10;";

    const updateTodoQuery = "UPDATE Todo SET Completed = ? WHERE Id = ?;";

    const { id } = req.params;

    const todo = req.body;

    try {
        await queryPromise(updateEndPoint);

        // Update todo
        let result = await queryPromise(updateTodoQuery, [todo.completed, id]);

        if (result.affectedRows == 0) {
            const error = {
                error: "Todo does not exist."
            }
            res.status(400).send(JSON.stringify(error));
        } else {
            res.sendStatus(200);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(JSON.stringify(error));
    }
})

// Delete a todo
app.delete(host + '/todo/:id', async (req, res) => {
    // increase requests count
    const updateEndPoint = "UPDATE Endpoint SET Requests = Requests + 1 WHERE Id = 11;";

    const deleteTodoQuery = "DELETE FROM Todo WHERE Id = ?;";

    const { id } = req.params;
    try {
        await queryPromise(updateEndPoint);

        // Delete todo
        let result = await queryPromise(deleteTodoQuery, [id]);

        if (result.affectedRows == 0) {
            const error = {
                error: "Todo does not exist."
            }
            res.status(400).send(JSON.stringify(error));
        } else {
            res.sendStatus(200);
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

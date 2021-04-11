const MethodEnum = {
    GET: "GET method",
    POST: "POST method",
    PUT: "PUT method",
    DELETE: "DELETE method"
}

class Endpoint {
    constructor(id, url, method, requests) {
        this.id = id;
        this.url = url; // string
        this.method = method; // MethodEnum
        this.requests = requests; // int
    }
}

class User {
    constructor(id, name, password, isAdmin) {
        this.id = id;
        this.name = name; // string
        this.password = password; // string
        this.isAdmin = isAdmin; // boolean
    }
}

class List {
    constructor(id, title, userId) {
        this.id = id;
        this.title = title; // string
        this.userId = userId; // int
    }
}

class Todo {
    constructor(id, title, listId, completed) {
        this.id = id;
        this.title = title; // string
        this.listId = listId; // int
        this.completed = completed; // boolean
    }
}

exports.Endpoint = Endpoint;
exports.MethodEnum = MethodEnum;
exports.User = User;
exports.List = List;
exports.Todo = Todo;

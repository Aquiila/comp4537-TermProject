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

exports.Endpoint = Endpoint;
exports.MethodEnum = MethodEnum;

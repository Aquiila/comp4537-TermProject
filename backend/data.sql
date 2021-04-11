-- Statistic
-- id 1
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/endpoint","GET");

-- User Account
-- id 2
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/user/create","POST");

-- id 3
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/user/login","POST");

-- List
-- id 4
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/list","POST");

-- id 5
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/list/{id}","GET");

-- id 6
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/list/{id}","PUT");

-- id 7
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/list/{id}","DELETE");

-- "Todo"
-- id 8
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/todo/{id}","POST");

-- id 9
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/todo/{id}","GET");

-- id 10
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/todo/{id}","PUT");

-- id 11
INSERT INTO Endpoint (Url, Method) 
VALUES ("/4537/termproject/API/V1/todo/{id}","DELETE");

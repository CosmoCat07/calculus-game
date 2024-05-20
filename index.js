import express from "express";
import expressWs from "express-ws";
const port = 3000;
const app = expressWs(express()).app;
app.use(express.static('public', { index: "./client/index.html" }));
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
app.ws('/socket', (ws) => {
    console.log("Stuff");
    ws.on('connection', () => {
        console.log("Successfully Connected");
    });
    ws.on('message', (msg) => {
        console.log(msg);
    });
    ws.emit("connection");
});

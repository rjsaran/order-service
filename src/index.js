const http = require('http')

const server = http.createServer(((req, res) => {
    res.writeHead(200, {
            "Content-Type" : "text/plain"
    });

    res.end("Order Service\n");
}));

server.listen(9091);
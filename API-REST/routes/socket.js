module.exports = function (server) {

    var io = require('socket.io').listen(server);

    io.sockets.on('connection', (client) => {
        // If changes were made => send signal to client
        client.on('updateProducts', () => {
            // Send the signal to everyone except sender
            client.broadcast.emit('updateClientProducts');
        });
	});
}
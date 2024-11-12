

const cppclient = async (id, watchedvideo) => {
    const net = require('net');
    return new Promise((resolve, reject) => {
        const HOST = 'localhost';  // C++ server IP
        const PORT = 55555;         // C++ server port

        // Create a TCP client
        const client = new net.Socket();

        // Connect to the C++ TCP server
        client.connect(PORT, HOST, () => {
            console.log('Connected to C++ server');

            const payload = { userId: id._id, videoId: watchedvideo };

            // Convert the payload to JSON and then to a Buffer
            const serializedPayload = JSON.stringify(payload);
           
            client.write(serializedPayload);
          
        });

        // Listen for data from the C++ server
        client.on('data', (data) => {
            console.log('Received data from server:', data.toString());
            resolve(data.toString()); // Resolve the promise with the received data
            client.destroy(); // Close the connection after receiving the response
        });

        // Handle connection close
        client.on('close', () => {
            console.log('Connection to C++ server closed');
        });

        // Handle errors
        client.on('error', (err) => {
            console.error(`Error: ${err.message}`);
            reject(err); // Reject the promise if there's an error
        });
    });
};

module.exports = cppclient;

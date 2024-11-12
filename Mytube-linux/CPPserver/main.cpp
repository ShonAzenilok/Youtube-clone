#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>
#include "recommendations.h"
#include "utilities.h"

// Handles communication with a single client
void handle_client(int client_sock) {
    char buffer[4096];
    int expected_data_len = sizeof(buffer);

    while (true) {
        int read_bytes = recv(client_sock, buffer, expected_data_len, 0);
        if (read_bytes == 0) {
            std::cout << "Connection closed by client" << std::endl;
            break;
        } else if (read_bytes < 0) {
            perror("Error receiving from client");
            break;
        } else {
            std::string message(buffer, read_bytes);
            std::string userId, videoId;
           

            // Parse the received message
            parseMessage(message, userId, videoId);
            std::cout << "Received userId: " << userId << ", videoId: " << videoId << std::endl;

            // Store user watching data and generate recommendations
            storeUserWatchData(userId, videoId);
            std::string recommendation = recommendVideos(userId);

            // Send the recommendations back to the client
            send(client_sock, recommendation.c_str(), recommendation.size(), 0);

            // Clear the buffer for the next message
            memset(buffer, 0, sizeof(buffer));
        }
    }

    close(client_sock);  // Close the client socket after communication ends
}

int main() {
    int server_sock = socket(AF_INET, SOCK_STREAM, 0);
    if (server_sock < 0) {
        perror("Failed to create socket");
        return -1;
    }

    sockaddr_in server_address;
    server_address.sin_family = AF_INET;
    server_address.sin_addr.s_addr = INADDR_ANY;
    server_address.sin_port = htons(55555);

    if (bind(server_sock, (struct sockaddr *)&server_address, sizeof(server_address)) < 0) {
        perror("Binding failed");
        close(server_sock);
        return -1;
    }

    if (listen(server_sock, 5) < 0) {
        perror("Listening failed");
        close(server_sock);
        return -1;
    }

    std::cout << "Server is running and listening on port 55555..." << std::endl;

    while (true) {
        sockaddr_in client_address;
        socklen_t client_len = sizeof(client_address);
        int client_sock = accept(server_sock, (struct sockaddr *)&client_address, &client_len);
        if (client_sock < 0) {
            perror("Failed to accept connection");
            continue;
        }

        // Handle the client connection
        handle_client(client_sock);
    }

    close(server_sock);
    return 0;
}
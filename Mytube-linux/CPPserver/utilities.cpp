#include "utilities.h"
#include <regex>

// Function to parse user and video IDs from the JSON string
void parseMessage(const std::string& message, std::string& userId, std::string& videoId) {
    std::regex userIdRegex(R"("userId"\s*:\s*"([^"]+))");
    std::regex videoIdRegex(R"("videoId"\s*:\s*"([^"]+))");
    std::smatch match;

    if (std::regex_search(message, match, userIdRegex) && match.size() > 1) {
        userId = match.str(1);
    }
    if (std::regex_search(message, match, videoIdRegex) && match.size() > 1) {
        videoId = match.str(1);
    }
}
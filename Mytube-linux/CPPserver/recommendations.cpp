#include "recommendations.h"
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <vector>
#include <iostream>
#include <string>

// User watch history: maps userId to a list of watched videoIds
std::unordered_map<std::string, std::vector<std::string>> userWatchHistory;

// Video view count: maps videoId to its view count (popularity)
std::unordered_map<std::string, int> videoViewCount;

// Store user watch data and update video view count
void storeUserWatchData(const std::string& userId, const std::string& videoId) {
    userWatchHistory[userId].push_back(videoId);
    videoViewCount[videoId]++;
}

// Recommend videos based on user watch history and popularity
std::string recommendVideos(const std::string& userId) {
    // Get the current user's watch history
    std::unordered_set<std::string> watchedVideos(userWatchHistory[userId].begin(), userWatchHistory[userId].end());
    
    std::unordered_map<std::string, int> recommendationScore;

    // Iterate through other users' watch histories to find similar users
    for (const auto& [otherUserId, otherUserVideos] : userWatchHistory) {
        if (otherUserId == userId) continue;  // Skip the current user

        // Calculate the overlap between the current user and other users
        int overlapCount = 0;
        for (const auto& videoId : otherUserVideos) {
            if (watchedVideos.find(videoId) != watchedVideos.end()) {
                overlapCount++;  // Count how many videos both users have watched
            }
        }

        // Only recommend videos if there is some overlap in watch history
        if (overlapCount > 0) {
            for (const auto& videoId : otherUserVideos) {
                if (watchedVideos.find(videoId) == watchedVideos.end()) {
                    // Score is weighted by overlap and popularity (view count)
                    recommendationScore[videoId] += (overlapCount * videoViewCount[videoId]);
                }
            }
        }
    }

    // Sort recommendations by score (popularity and similarity)
    std::vector<std::pair<std::string, int>> sortedRecommendations(recommendationScore.begin(), recommendationScore.end());
    std::sort(sortedRecommendations.begin(), sortedRecommendations.end(),
              [](const std::pair<std::string, int>& a, const std::pair<std::string, int>& b) { return a.second > b.second; });

    // Build the recommendation string
    std::string recommendations = " ";
    int count = 0;

    // Add top-scoring recommendations (up to 6)
    for (const auto& [videoId, score] : sortedRecommendations) {
        recommendations += videoId + " ";
        if (++count >= 6) break;  // Return top 6 recommendations
    }

    return recommendations;
}
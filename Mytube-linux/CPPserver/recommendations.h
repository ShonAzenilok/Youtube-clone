#ifndef RECOMMENDATIONS_H
#define RECOMMENDATIONS_H

#include <string>

void storeUserWatchData(const std::string& userId, const std::string& videoId);
std::string recommendVideos(const std::string& userId);

#endif // RECOMMENDATIONS_H
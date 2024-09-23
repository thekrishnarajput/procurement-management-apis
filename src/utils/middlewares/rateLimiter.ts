import rateLimit from "express-rate-limit";


export const limiter = rateLimit({
    max: 100, // 100 Request limit per individual IP
    windowMs: 15 * 60 * 1000, // 15 Minutes rate limit for each IP address
    message: "100 requests exceeded from this IP, please try again after 15 minutes",
});


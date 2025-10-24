"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionMiddleware = void 0;
const versionMiddleware = (req, res, next) => {
    console.log("versionMiddleware: Starting version detection...");
    // Check multiple sources for version in order of preference
    const version = req.headers['api-version'] || // Custom header (most common)
        req.headers['accept-version'] || // Alternative header
        req.query.version || // Query param fallback
        'v1'; // Default version
    console.log("versionMiddleware: Detected version:", version);
    // Normalize version to string for validation
    const versionStr = Array.isArray(version) ? version[0] : version;
    if (typeof versionStr !== 'string' || !['v1', 'v2'].includes(versionStr)) {
        console.log("versionMiddleware: ERROR - Invalid version:", version);
        res.status(400).json({
            error: 'Invalid API version. Supported versions: v1, v2'
        });
        return;
    }
    req.apiVersion = versionStr;
    console.log("versionMiddleware: Version set successfully:", req.apiVersion);
    next();
};
exports.versionMiddleware = versionMiddleware;

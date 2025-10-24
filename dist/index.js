"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const versionMiddleware_1 = require("./middleware/versionMiddleware");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const sportRoutes_1 = __importDefault(require("./routes/sportRoutes"));
const meetupRoutes_1 = __importDefault(require("./routes/meetupRoutes"));
// for dotenv to work.
dotenv_1.default.config();
const app = (0, express_1.default)();
// Add CORS configuration BEFORE your routes
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow cookies/credentials if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'api-version', 'X-Requested-With']
}));
// Add cookie-parser middleware BEFORE routes
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Apply versioning middleware to all API routes
app.use('/api', versionMiddleware_1.versionMiddleware);
app.use('/api/user', userRoutes_1.default);
app.use('/api/sports', sportRoutes_1.default);
app.use('/api/meetups', meetupRoutes_1.default);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.default = app;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const sportRoutes_1 = __importDefault(require("./routes/sportRoutes"));
const meetupRoutes_1 = __importDefault(require("./routes/meetupRoutes"));
// for dotenv to work.
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/user', userRoutes_1.default);
app.use('/api/sports', sportRoutes_1.default);
app.use('/api/meetups', meetupRoutes_1.default);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.default = app;

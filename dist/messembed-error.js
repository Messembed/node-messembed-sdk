"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessembedError = void 0;
class MessembedError extends Error {
    constructor(message, code, response) {
        super(message);
        Object.setPrototypeOf(this, MessembedError.prototype);
        this.code = code;
        this.response = response;
    }
}
exports.MessembedError = MessembedError;
//# sourceMappingURL=messembed-error.js.map
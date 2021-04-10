export declare class MessembedError extends Error {
    code: string;
    response?: any;
    constructor(message: string, code: string, response?: any);
}

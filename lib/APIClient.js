import axios from "axios";
export class SessionExpiredError extends Error {
    isSessionExpiredError = true;
    constructor(message) {
        super(message);
    }
}
const DEFAULT_CONFIG = {
    defaultHeaders: { "content-type": "application/json" },
    handleErrors: (err) => { },
    requestInterceptors: (config) => config,
    responseInterceptors: (response) => response,
    baseURL: "",
    options: {},
};
export class APIClient {
    defaultHeaders;
    handleErrors;
    requestInterceptors;
    responseInterceptors;
    baseURL;
    options;
    constructor({ handleErrors, defaultHeaders, requestInterceptors, responseInterceptors, baseURL, options, }) {
        this.defaultHeaders = defaultHeaders || DEFAULT_CONFIG.defaultHeaders;
        this.handleErrors = handleErrors || DEFAULT_CONFIG.handleErrors;
        this.requestInterceptors =
            requestInterceptors || DEFAULT_CONFIG.requestInterceptors;
        this.responseInterceptors =
            responseInterceptors || DEFAULT_CONFIG.responseInterceptors;
        this.baseURL = baseURL || DEFAULT_CONFIG.baseURL;
        this.options = options || DEFAULT_CONFIG.options;
    }
    async request({ url, ...config }) {
        try {
            const modifiedConfig = this.requestInterceptors(config);
            const res = await axios({ url: this.baseURL + url, ...modifiedConfig });
            return this.responseInterceptors(res);
        }
        catch (err) {
            this.handleErrors(err);
        }
    }
    async makeRequest(method, { url, headers = this.defaultHeaders, ...config }) {
        return await this.request({ url, method, headers, ...config });
    }
    async GET(params) {
        return await this.makeRequest("GET", params);
    }
    async POST(params) {
        return await this.makeRequest("POST", params);
    }
    async PUT(params) {
        return await this.makeRequest("PUT", params);
    }
    async PATCH(params) {
        return await this.makeRequest("PATCH", params);
    }
    async DELETE(params) {
        return await this.makeRequest("DELETE", params);
    }
}

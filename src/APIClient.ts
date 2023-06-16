import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export class SessionExpiredError extends Error {
	isSessionExpiredError = true;
	constructor(message?: string) {
		super(message);
	}
}

export type RequestMethod =
	| "POST"
	| "GET"
	| "PUT"
	| "DELETE"
	| "PATCH"
	| "OPTIONS"
	| "HEAD"
	| "TRACE";

export interface RequestParams extends AxiosRequestConfig {
	url: string;
}

export interface ClientProviderParams {
	defaultHeaders?: { [key: string]: string };
	handleErrors?: (err: Error | AxiosError | any) => any;
	requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
	responseInterceptors?: (response: AxiosResponse) => AxiosResponse;
	baseURL?: string;
	options?: any;
}

const DEFAULT_CONFIG = {
	defaultHeaders: { "content-type": "application/json" },
	handleErrors: (err: Error | AxiosError | any) => {},
	requestInterceptors: (config: AxiosRequestConfig) => config,
	responseInterceptors: (response: AxiosResponse) => response,
	baseURL: "",
	options: {},
};

export class APIClient {
	defaultHeaders: { [key: string]: string };
	handleErrors: (err: Error | AxiosError | any) => any;
	requestInterceptors: (config: AxiosRequestConfig) => AxiosRequestConfig;
	responseInterceptors: (response: AxiosResponse) => AxiosResponse;
	baseURL: string;
	options: any;

	constructor({
		handleErrors,
		defaultHeaders,
		requestInterceptors,
		responseInterceptors,
		baseURL,
		options,
	}: ClientProviderParams) {
		this.defaultHeaders = defaultHeaders || DEFAULT_CONFIG.defaultHeaders;
		this.handleErrors = handleErrors || DEFAULT_CONFIG.handleErrors;
		this.requestInterceptors =
			requestInterceptors || DEFAULT_CONFIG.requestInterceptors;
		this.responseInterceptors =
			responseInterceptors || DEFAULT_CONFIG.responseInterceptors;
		this.baseURL = baseURL || DEFAULT_CONFIG.baseURL;
		this.options = options || DEFAULT_CONFIG.options;
	}

	async request({ url, ...config }: RequestParams) {
		try {
			const modifiedConfig = this.requestInterceptors(config);

			const res = await axios({ url: this.baseURL + url, ...modifiedConfig });

			return this.responseInterceptors(res);
		} catch (err: Error | AxiosError | any) {
			this.handleErrors(err);
		}
	}

	private async makeRequest(
		method: RequestMethod,
		{ url, headers = this.defaultHeaders, ...config }: RequestParams
	) {
		return await this.request({ url, method, headers, ...config });
	}

	async GET(params: RequestParams) {
		return await this.makeRequest("GET", params);
	}

	async POST(params: RequestParams) {
		return await this.makeRequest("POST", params);
	}

	async PUT(params: RequestParams) {
		return await this.makeRequest("PUT", params);
	}

	async PATCH(params: RequestParams) {
		return await this.makeRequest("PATCH", params);
	}

	async DELETE(params: RequestParams) {
		return await this.makeRequest("DELETE", params);
	}
}

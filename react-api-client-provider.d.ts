declare module "react-api-client-provider" {
	import { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
	import { PropsWithChildren, Dispatch, SetStateAction } from "react";

	interface ClientProviderParams {
		/**
		 * Default headers for the API Client
		 */
		defaultHeaders?: { [key: string]: string };

		/**
		 * Custom error handling method when request
		 * is thrown by axios
		 */
		handleErrors?: (err: Error | AxiosError | any) => any;

		/**
		 * Any custom axios request interceptors
		 */
		requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;

		/**
		 * Any custom axios response interceptors
		 */
		responseInterceptors?: (response: AxiosResponse) => AxiosResponse;

		/**
		 * Base URL for all API calls. If not set, will default to
		 * an empty string value
		 */
		baseURL?: string;
	}

	type ClientProviderProps = ClientProviderParams & {
		/**
		 * Any extra options that can be accessed
		 * by the useClient hook
		 */
		options?: any;
	};

	interface RequestParams extends AxiosRequestConfig {
		url: string;
	}

	interface APIClientHookProps<T = any> extends RequestParams {
		defaultValue?: T;
	}

	interface APIClientHookResponse<T = any> {
		data: T;
		isLoading: boolean;
		isError: boolean;
		setData: Dispatch<T>;
		setIsLoading: Dispatch<SetStateAction<boolean>>;
		setIsError: Dispatch<SetStateAction<boolean>>;
	}

	interface IAPIClient {
		new (params: ClientProviderParams): IAPIClient;

		/**
		 * Generic request method
		 */
		request(params: RequestParams): Promise<AxiosResponse>;

		/**
		 * Shorthand for making a GET request
		 */
		GET(params: RequestParams): Promise<AxiosResponse>;

		/**
		 * Shorthand for making a POST request
		 */
		POST(params: RequestParams): Promise<AxiosResponse>;

		/**
		 * Shorthand for making a PATCH request
		 */
		PATCH(params: RequestParams): Promise<AxiosResponse>;

		/**
		 * Shorthand for making a PUT request
		 */
		PUT(params: RequestParams): Promise<AxiosResponse>;

		/**
		 * Shorthand for making a DELETE request
		 */
		DELETE(params: RequestParams): Promise<AxiosResponse>;
	}

	function APIClient(params: ClientProviderParams): IAPIClient;

	/**
	 * An axios API client wrapper instance that allows
	 * it to be shared across components in the Application
	 */
	function APIClientProvider(
		params: PropsWithChildren<ClientProviderProps>
	): JSX.Element;

	/**
	 * This hook allows any child component of the Provider
	 * to access the client instance
	 */
	function useClient(): {
		/**
		 * Instance of the API client
		 */
		client: IAPIClient;

		/**
		 * Extra options set during Provider setup
		 */
		options: any;
	};

	/**
	 * Returns the regular data / loading / error states
	 * from a call when a component mounts with useEffect
	 */
	function useAPIClientCallOnLoad<T = any>(
		props: APIClientHookProps<T>
	): APIClientHookResponse<T>;

	/**
	 * Returns the regular data / loading / error states
	 * as well as the makeRequest call to avoid having to
	 * declare the states manually in a component
	 */
	function useAPIClientStateCall<T = any>(
		props: APIClientHookProps<T>
	): APIClientHookResponse<T> & { makeRequest: () => Promise<void> };
}

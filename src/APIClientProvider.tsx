import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { APIClient, ClientProviderParams, RequestParams } from "./APIClient";

const ClientContext = createContext<{ client: APIClient; options: any }>({
	client: new APIClient({}),
	options: {},
});

type ClientProviderProps = ClientProviderParams & {
	options?: any;
};

const DEFAULT_ERROR_HANDLING = (err: any) => {
	throw err;
};

export const APIClientProvider = ({
	children,
	baseURL,
	defaultHeaders,
	handleErrors = DEFAULT_ERROR_HANDLING,
	requestInterceptors,
	responseInterceptors,
	options,
}: PropsWithChildren<ClientProviderProps>) => {
	const [client] = useState(
		new APIClient({
			baseURL,
			defaultHeaders,
			handleErrors,
			requestInterceptors,
			responseInterceptors,
		})
	);

	const value = useMemo(
		() => ({
			client,
			options,
		}),
		[client, options]
	);

	return (
		<ClientContext.Provider value={value}>{children}</ClientContext.Provider>
	);
};

export const useClient = () => {
	const ctx = useContext(ClientContext);
	if (!ctx) {
		throw new Error("useClient must be used within a ClientProvider");
	}
	return ctx;
};

interface APIClientHookProps extends RequestParams {
	defaultValue?: any;
}

export const useAPIClientCallOnLoad = (params: APIClientHookProps) => {
	const [data, setData] = useState(params.defaultValue);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	const { client } = useClient();

	useEffect(() => {
		if (!client) return;
		if (!params.method) {
			throw new Error("Cannot make an API call if method is not specified");
		}
		let isMounted = true;
		setIsLoading(true);

		const makeRequest = async () => {
			try {
				const res = await client.request(params);
				if (!res) throw new Error("Client failed to make request");
				if (!isMounted) return;
				setData(res.data);
			} catch (error) {
				if (!isMounted) return;
				setIsError(true);
			} finally {
				if (!isMounted) return;
				setIsLoading(false);
			}
		};

		makeRequest();

		return () => {
			isMounted = false;
		};
	}, [client]);

	return { data, isLoading, isError, setData, setIsLoading, setIsError };
};

export const useAPIClientStateCall = (params: APIClientHookProps) => {
	const [data, setData] = useState(params.defaultValue);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const { client } = useClient();

	const makeRequest = async () => {
		if (!params.method)
			throw new Error("Cannot make an API call if method is not specified");

		setIsLoading(true);

		try {
			const res = await client.request(params);
			if (!res) throw new Error("Client failed to make request");
			setData(res.data);
		} catch (error) {
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		data,
		isLoading,
		isError,
		makeRequest,
		setData,
		setIsError,
		setIsLoading,
	};
};

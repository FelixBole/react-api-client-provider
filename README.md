# React API Client Provider

![Version](https://img.shields.io/npm/v/react-api-client-provider)

A customizable API client for React that uses axios under the hood. This is useful if you want a centralized client for handling errors and other operations and have it be accessible through a custom hook throughout the react application.

This is not a fancy library, it just encapsulates an instance of an axios client to make it available through the app. The configuration is very customizable as the client exposes axios options directly.

## Installation

```bash
npm i react-api-client-provider
```

## Usage

Import the APIClientProvider and encapsulate the part of your app that you want to share the API client instance with and pass it the optional default configuration of your choice.

```jsx
import { APIClientProvider } from "react-api-client-provider";

const MyComponent = () => {
	return (
		<APIClientProvider>
			<App />
		</APIClientProvider>
	);
};
```

## Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `baseURL` | string | false | Set this up to have the client call the same baseURL for every request, if not set, you should provide the full url on each request |
| `defaultHeaders` | {[key: string]: string} | false | If you want the client to pass in default headers in every request |
| `handleErrors` | (err: Error \| AxiosError \| any) => any | false | For a custom error handling function when an API call fails |
| `requestInterceptors` | (config: AxiosRequestConfig) => AxiosRequestConfig | false | Any request interceptors you want to put in place for client requests (check axios docs) |
| `responseInterceptors` | (config: AxiosResponse) => AxiosResponse | false | Any response interceptors you want to put in place for client responses (check axios docs) |
| `options` | any | false | Any additional custom options that you want to make accessible through the useClient hook's options field |

## Custom Hooks

### useClient

The useClient hook allows child components to access the client instance and the optional options if setup during initialization. It then allows them to use client methods directly.

```jsx
import { useClient } from "react-api-client-provider";

const MyComponent = () => {
	const { client } = useClient();

	const handleClick = async () => {
		await client.GET({ url: YOUR_URL });
	};

	return <button onClick={handleClick}>Get data</button>;
};
```

### useAPIClientCallOnLoad

This hook allows you to leverage the hook functionalities to avoid setting the regular `data`, `isLoading`, `isError` states whenever making an API call using useEffect when a component mounts. It generates the states for you, makes the request and returns you the different states.

Please keep in mind that when using this hook, specifying the method is mandatory.

```jsx
import { useAPIClientCallOnLoad } from "react-api-client-provider";

const MyComponent = () => {
	const { data, isLoading, isError } = useAPIClientCallOnLoad({
		url: YOUR_URL,
		method: "GET",
	});

	// Rest of your code
};
```

For typescript users, you can specify a generic type on the hook so that your returned data is typed the way you want.

### useAPIClientStateCall

This hook allows you to leverage the hook functionalities to avoid setting the regular `data`, `isLoading`, `isError` states yourselves when making a _manual_ API call. The hook will handle state changes by providing you with a method to activate the API call.

Please keep in mind that when using this hook, specifying the method is mandatory.

```jsx
import { useAPIClientStateCall } from "react-api-client-provider";

const MyComponent = () => {
	const { data, isLoading, isError, makeRequest } = useAPIClientStateCall({
		url: YOUR_URL,
		method: "GET",
	});

	return <button onClick={makeRequest}>Get data</button>;
};
```

For typescript users, you can specify a generic type on the hook so that your returned data is typed the way you want.

## Client shorthand methods

The client has a basic `request` method but there are shorthands for the different other API request methods, `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.

import {createTheme, NextUIProvider} from '@nextui-org/react';

function MyApp({Component, pageProps}) {
    return (
        <NextUIProvider theme={ createTheme({
            type: "dark"
        }) }>
            <Component { ...pageProps } />
        </NextUIProvider>
    );
}

export default MyApp;

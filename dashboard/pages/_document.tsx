import React from 'react';
import Document, {Head, Html, Main, NextScript} from 'next/document';
import {CssBaseline} from '@nextui-org/react';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: React.Children.toArray([initialProps.styles])
        };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    { CssBaseline.flush() }
                    <link rel="shortcut icon"
                          href="https://github.com/SudhanPlayz/Discord-MusicBot/blob/v5/assets/logo.gif"
                          type="image/png"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;

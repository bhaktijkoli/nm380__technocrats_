import React from 'react';
import Document, {Html, Head, Main, NextScript} from 'next/document';
import {Provider as NextAuthProvider} from 'next-auth/client';
import {ServerStyleSheets} from '@material-ui/core/styles';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        // NextJS & Material-UI Setup
        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
            });
        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
        };
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="theme-color" content="#ff33dd" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    {/* TODO: Update head fields: description, style */}
                </Head>
                <body>
                    <NextAuthProvider>
                        <Main />
                    </NextAuthProvider>
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

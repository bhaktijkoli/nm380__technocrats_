import React from 'react';
import App from 'next/app';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../styles/theme';

class MyApp extends App {
    static async getInitialProps({Component, ctx}) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        if (ctx.req && ctx.req.passport) {
            pageProps.user = ctx.req.user;
        }
        return {pageProps};
    }

    constructor(props) {
        super(props);
        this.state = {
            user: props.pageProps.user,
        };
    }

    componentDidMount() {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }

    render() {
        const {Component, pageProps} = this.props;
        const props = {
            ...pageProps,
            user: this.state.user,
        };
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...props} />
            </ThemeProvider>
        );
    }
}

export default MyApp;

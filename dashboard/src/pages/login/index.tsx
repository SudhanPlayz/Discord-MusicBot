import ProcessData from '@/components/ProcessData';
import { useGetLoginURL } from '@/services/api';
import { getQueryData } from '@/utils/query';
import Head from 'next/head';
import { useEffect } from 'react';

function Redirecting() {
    return <h1>Redirecting you to login...</h1>;
}

const Login = () => {
    const { data, isLoading } = useGetLoginURL();

    const opts = {
        loadingComponent: <Redirecting />,
        failedComponent: <h1>Failed logging in</h1>,
    };

    const url = getQueryData(data);

    useEffect(() => {
        if (url) window.location.href = url;
    }, []);

    return (
        <>
            <Head>
                <title>Logging In | Discord Music Bot</title>
            </Head>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <ProcessData {...{ data, isLoading, ...opts }}>
                    {opts.loadingComponent}
                </ProcessData>
            </div>
        </>
    );
};

export default Login;

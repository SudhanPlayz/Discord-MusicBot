import ProcessData from '@/components/ProcessData';
import { useGetLoginURL, usePostLogin } from '@/services/api';
import { saveUser } from '@/utils/localStorage';
import { getQueryData } from '@/utils/query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function LoggingIn() {
    return <h1>Logging in...</h1>;
}

// it doesn't seems like it does anything
// but i can guarantee you this page will
// break if you remove this, so don't
export const getServerSideProps = () => {
    return { props: {} };
};

const Login = () => {
    const router = useRouter();
    const query = router.query;

    const enableGetLoginURL = !query.code;

    const { data: loginURL, isLoading } = useGetLoginURL({
        enabled: enableGetLoginURL,
    });

    const { data } = usePostLogin(query, {
        onError: () => router.replace('/login'),
    });

    const url = getQueryData(loginURL);

    useEffect(() => {
        if (url)
            window.location.href =
                url +
                '&redirect_uri=' +
                encodeURIComponent(window.location.href);
    }, [url]);

    if (data?.data) {
        saveUser(data.data);

        router.replace('/dashboard');
    }

    const opts = {
        loadingComponent: <LoggingIn />,
        failedComponent: <h1>Failed logging in</h1>,
        enabled: enableGetLoginURL,
    };

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
                <ProcessData {...{ data: loginURL, isLoading, ...opts }}>
                    {opts.loadingComponent}
                </ProcessData>
            </div>
        </>
    );
};

export default Login;

import { logout } from '@/utils/common';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Logout(_props: any) {
    const router = useRouter();

    useEffect(() => {
        logout();
        router.replace('/');
    }, []);

    return (
        <>
            <Head>
                <title>Logging Out | Discord Music Bot</title>
            </Head>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <h1>Logging out...</h1>
            </div>
        </>
    );
}

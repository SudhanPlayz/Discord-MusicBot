import { getInvite } from '@/services/api';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const getServerSideProps = () => {
    return { props: {} };
};

export default function Logout(_props: any) {
    const router = useRouter();

    useEffect(() => {
        getInvite().then((inv) => {
            if (!inv?.data?.length) throw new Error("Can't get invite");

            let appendUri = router.query.redirect_uri?.length
                ? '&redirect_uri=' +
                  encodeURIComponent(router.query.redirect_uri as string)
                : '';

            router.replace(inv.data + appendUri);
        });
    }, []);

    return (
        <>
            <Head>
                <title>Invite | Discord Music Bot</title>
            </Head>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <h1>Inviting...</h1>
            </div>
        </>
    );
}

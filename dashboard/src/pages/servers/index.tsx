import Head from 'next/head';
import Server from '@/components/server';
import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useGetServerList } from '@/services/api';
import { useProcessData } from '@/hooks/useProcessData';
import { getQueryData } from '@/utils/query';

const Servers: NextPageWithLayout = () => {
    const { data, isLoading } = useGetServerList();

    const processData = useProcessData(data, isLoading);

    console.log('serverList:', data);

    const { servers } = getQueryData(data) || {};

    return (
        <>
            <Head>
                <title>Servers | Discord Music Bot</title>
            </Head>
            <h1>Select a server</h1>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                {processData(() =>
                    servers?.map((server) => (
                        <Server key={server.id} {...server} />
                    )),
                )}
            </div>
        </>
    );
};

Servers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Servers;

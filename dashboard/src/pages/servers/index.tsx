import Head from 'next/head';
import { useEffect, useState } from 'react';
import Server from '@/components/server';
import { apiCall } from '@/utils/serviceCall';
import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';

interface IServer {
    id: string;
    icon: string;
    name: string;
}

const Servers: NextPageWithLayout = () => {
    const [servers, setServers] = useState<IServer[]>();

    useEffect(() => {
        async function getServerList() {
            setServers((await apiCall('GET', '/servers')).data.servers);
        }
        getServerList();
    }, []);

    return (
        <>
            <Head>
                <title>Servers | Discord Music Bot</title>
            </Head>
            <h1>Select a server</h1>
            <div
                style={{
                    display: 'flex',
                }}
            >
                {servers?.map((server) => (
                    <Server
                        key={server.id}
                        id={server.id}
                        icon={server.icon}
                        name={server.name}
                    />
                ))}
            </div>
        </>
    );
};

Servers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Servers;

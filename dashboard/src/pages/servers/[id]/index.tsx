import Head from 'next/head';
import { useEffect, useState } from 'react';
import { apiCall } from '@/utils/serviceCall';
import { useRouter } from 'next/router';
import { Avatar } from '@nextui-org/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { NextPageWithLayout } from '@/interfaces/layouts';

const Server: NextPageWithLayout = () => {
    const [loading, setLoading] = useState(true);
    const [server, setServer] = useState(null);
    const serverId = useRouter().query.id;

    useEffect(() => {
        async function getServer() {
            setServer(
                (await apiCall('GET', '/servers', { id: serverId })).data,
            );
        }
        getServer();
        setLoading(false);
    }, []);

    return (
        <>
            <Head>
                <title>{server?.name} | Discord Music Bot</title>
            </Head>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    <Avatar
                        src={server?.icon}
                        size="xl"
                        color="gradient"
                        bordered
                        pointer
                    />
                    <h1>{server?.name}</h1>
                </>
            )}
            <h2>Server ID: {server?.id}</h2>
            <h2>Server Owner: {server?.owner}</h2>
            <h2>
                Server Roles:
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    {server?.roles.map(
                        (role: { id: string; name: string; color: string }) => {
                            return (
                                <div
                                    key={role.id}
                                    style={{
                                        color: 'white',
                                        backgroundColor: role.color,
                                        padding: '5px',
                                        borderRadius: '5px',
                                        margin: '5px',
                                    }}
                                >
                                    {role.name}
                                </div>
                            );
                        },
                    )}
                </div>
            </h2>
            <h2>Server Members: {server?.members.length}</h2>
            <h2>Server Channels: {server?.channels.length}</h2>
            {/* Player */}
            <h2>Server Queue: {server?.player?.queue?.length || 0}</h2>
            <h2>
                Server Now Playing:{' '}
                {server?.player?.playing?.title || 'Nothing'}
            </h2>
        </>
    );
};

Server.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Server;

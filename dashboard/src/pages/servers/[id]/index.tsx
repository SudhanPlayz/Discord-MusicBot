import Head from 'next/head';
import { useRouter } from 'next/router';
import { Avatar, Button } from '@nextui-org/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { NextPageWithLayout } from '@/interfaces/layouts';
import { useGetServer } from '@/services/api';
import { getQueryData } from '@/utils/query';
import ProcessData from '@/components/ProcessData';
import type { AxiosError } from 'axios';

function Loading() {
    return (
        <>
            <Head>
                <title>Discord Music Bot</title>
            </Head>
            <h1>Loading...</h1>
        </>
    );
}

function Failed({ error }: { error?: AxiosError }) {
    const router = useRouter();

    const back = () => {
        router.push('/servers');
    };

    if (error?.response?.status === 404)
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                }}
            >
                <h1>Bot isn&apos;t in the server, it&apos;s gone!</h1>

                <div>
                    <Button shadow size={'lg'} onClick={back}>
                        Return to server list
                    </Button>
                </div>
            </div>
        );

    return <h1>Failed to fetch server data</h1>;
}

const Server: NextPageWithLayout = () => {
    const router = useRouter();
    const serverId = router.query.id;
    const { data, isLoading, error } = useGetServer(serverId as string);

    console.log('server:', data);

    const { id, name, icon, owner, roles, channels, members, player } =
        getQueryData(data) || {};

    return (
        <ProcessData
            {...{ data, isLoading }}
            loadingComponent={<Loading />}
            failedComponent={<Failed error={error as AxiosError} />}
        >
            <Head>
                <title>{name} | Discord Music Bot</title>
            </Head>
            <Avatar src={icon} size="xl" color="gradient" bordered pointer />
            <h1>{name}</h1>
            <h2>Server ID: {id}</h2>
            <h2>Server Owner: {owner}</h2>
            <h2>
                Server Roles:
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    {roles?.map(
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
            <h2>Server Members: {members?.length}</h2>
            <h2>Server Channels: {channels?.length}</h2>
            {/* Player */}
            <h2>Server Queue: {player?.queue?.length || 0}</h2>
            <h2>Server Now Playing: {player?.playing?.title || 'Nothing'}</h2>
        </ProcessData>
    );
};

Server.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Server;

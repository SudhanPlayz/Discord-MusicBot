import Head from 'next/head';
import {
    AudiotrackRounded,
    DnsRounded,
    PersonRounded,
    RocketLaunchRounded,
} from '@mui/icons-material';
import StatCard from '@/components/StatCard';
import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useGetDashboardData } from '@/services/api';
import { getQueryData } from '@/utils/query';
import { useProcessData } from '@/hooks/useProcessData';
import { HalfContainer, HalfContainerCard } from '@/components/containers';
import { Container, Text } from '@nextui-org/react';

const Dashboard: NextPageWithLayout = () => {
    const { data, isLoading } = useGetDashboardData();

    const processData = useProcessData(data, isLoading);

    console.log('dashboardData:', data);

    const { commandsRan, users, servers, songsPlayed, nodes } =
        getQueryData(data) || {};

    return (
        <>
            <Head>
                <title>Dashboard | Discord Music Bot</title>
            </Head>

            <h1>Dashboard</h1>
            <Container
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                <HalfContainer>
                    <StatCard
                        title="Commands Ran"
                        amount={processData(commandsRan)}
                        icon={<RocketLaunchRounded fontSize="large" />}
                    />
                    <StatCard
                        title="Users"
                        amount={processData(users)}
                        icon={<PersonRounded fontSize="large" />}
                    />
                    <StatCard
                        title="Servers"
                        amount={processData(servers)}
                        icon={<DnsRounded fontSize="large" />}
                    />

                    <StatCard
                        title="Songs Played"
                        amount={processData(songsPlayed)}
                        icon={<AudiotrackRounded fontSize="large" />}
                    />

                </HalfContainer>
                <HalfContainer>
                    <HalfContainerCard>
                    <Text h4 css={ {color: 'GrayText'} }>Nodes</Text>
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                }}
                            >
                                {
                                    nodes &&
                                    Object.entries(nodes).map(
                                        ([nodeId, node]) => (
                                            <div key={nodeId}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <span style={{ fontSize: '16px', fontWeight: 600 }}>{nodeId}</span>
                                                <div
                                                    style={{
                                                        backgroundColor: '#121212',
                                                        borderRadius: '5px',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <pre
                                                        style={{
                                                            fontSize: '12px',
                                                            color: node.connected ? 'green' : 'red',
                                                        }}
                                                    >
                                                        <div>
                                                            Uptime: {node.stats.uptime}
                                                        </div>
                                                        <div>
                                                            RAM: {node.stats.ramUsage} MB / {node.stats.ramTotal} MB
                                                        </div>
                                                        <div>
                                                            CPU: {node.stats.cores === 1 ? '1 Core' : `${node.stats.cores} Cores`}
                                                        </div>
                                                        <div>
                                                            Players: {node.nodeStats.playingPlayers}/{node.nodeStats.players}
                                                        </div>
                                                    </pre>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </HalfContainerCard>
                </HalfContainer>
            </Container>
        </>
    );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;

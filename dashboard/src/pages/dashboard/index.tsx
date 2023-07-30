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

const Dashboard: NextPageWithLayout = () => {
    const { data, isLoading } = useGetDashboardData();

    const processData = useProcessData(data, isLoading);

    console.log('dashboardData:', data);

    const { commandsRan, users, servers, songsPlayed } =
        getQueryData(data) || {};

    return (
        <>
            <Head>
                <title>Dashboard | Discord Music Bot</title>
            </Head>

            <h1>Dashboard</h1>
            <div
                style={{
                    display: 'flex',
                }}
            >
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
            </div>
        </>
    );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;

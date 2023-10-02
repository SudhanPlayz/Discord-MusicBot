import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useRouter } from 'next/router';

const Player: NextPageWithLayout = () => {
    const router = useRouter();
    const serverId = router.query.id;

    return <h1>Player {serverId}</h1>;
};

Player.getLayout = (page) => (
    <DashboardLayout
        contentContainerStyle={{
            width: '100%',
            display: 'flex',
            zIndex: 0,
            backgroundColor: 'black',
        }}
        navbarProps={{
            show: false,
        }}
    >
        {page}
    </DashboardLayout>
);

export default Player;

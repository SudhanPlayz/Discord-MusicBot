import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { getSharedState } from '@/libs/sharedState';
import { Button, Container } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Player: NextPageWithLayout = () => {
    const router = useRouter();
    const serverId = router.query.id;

    const sharedState = getSharedState();

    useEffect(() => {
        if (sharedState.navbarShow && sharedState.setNavbarShow) {
            sharedState.setNavbarShow(false);
        }

        return () => {
            if (!sharedState.navbarShow && sharedState.setNavbarShow) {
                sharedState.setNavbarShow(true);
            }
        };
    }, []);

    const handleNavbarToggle = () => {
        if (!sharedState.setNavbarShow) return;

        sharedState.setNavbarShow((v) => !v);
    };

    return (
        <Container
            css={{
                display: 'flex',
                justifyContent: 'center',
                padding: 0,
            }}
        >
            <Button onClick={handleNavbarToggle}>Buffon</Button>
            <h1>Player {serverId}</h1>
        </Container>
    );
};

Player.getLayout = (page) => (
    <DashboardLayout
        contentContainerStyle={{
            width: '100%',
            display: 'flex',
            zIndex: 0,
            backgroundColor: 'black',
        }}
    >
        {page}
    </DashboardLayout>
);

export default Player;

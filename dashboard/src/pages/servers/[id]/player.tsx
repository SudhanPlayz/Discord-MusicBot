import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button, Container } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NavbarIcon from '@/assets/icons/navbar-icon.svg';
import classNames from 'classnames';
import useSharedStateGetter from '@/hooks/useSharedStateGetter';

const Player: NextPageWithLayout = () => {
    const router = useRouter();
    const serverId = router.query.id;

    const sharedState = useSharedStateGetter();

    useEffect(() => {
        if (sharedState.navbarShow && sharedState.setNavbarShow) {
            sharedState.setNavbarShow(false);
        }

        return () => {
            if (!sharedState.navbarShow && sharedState.setNavbarShow) {
                sharedState.setNavbarShow(true);
            }

            if (sharedState.navbarAbsolute && sharedState.setNavbarAbsolute) {
                sharedState.setNavbarAbsolute(false);
            }
        };
    }, []);

    const handleNavbarToggle = () => {
        if (!sharedState.setNavbarShow) return;
        if (!sharedState.navbarAbsolute) {
            if (!sharedState.setNavbarAbsolute) return;
            sharedState.setNavbarAbsolute(true);
        }

        sharedState.setNavbarShow((v) => !v);
    };

    return (
        <Container
            className="player-page-container"
            css={{
                display: 'flex',
                justifyContent: 'center',
                padding: 0,
            }}
        >
            <div
                className={classNames(
                    'btn-navbar-toggle-container',
                    sharedState.navbarShow && sharedState.navbarAbsolute
                        ? 'follow-navbar'
                        : '',
                )}
            >
                <Button
                    onClick={handleNavbarToggle}
                    className={classNames('btn-navbar-toggle')}
                    css={{
                        backgroundColor: 'black',
                        '&:hover': {
                            backgroundColor: '$primary',
                        },
                    }}
                    color="default"
                >
                    <NavbarIcon />
                </Button>
            </div>
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

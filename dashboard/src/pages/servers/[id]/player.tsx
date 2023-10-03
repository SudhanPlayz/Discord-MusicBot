import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button, Container } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavbarIcon from '@/assets/icons/navbar-icon.svg';
import classNames from 'classnames';
import useSharedStateGetter from '@/hooks/useSharedStateGetter';
import CaretIconLeft from '@/assets/icons/caret-outline-left.svg';
import CaretIconRight from '@/assets/icons/caret-outline-right.svg';
import PlaylistBar from '@/components/PlaylistBar';
import XIcon from '@/assets/icons/x-solid.svg';

const Player: NextPageWithLayout = () => {
    const router = useRouter();
    const serverId = router.query.id;

    const [playlistShow, setPlaylistShow] = useState(false);

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

    const handlePlaylistToggle = () => {
        setPlaylistShow((v) => !v);
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
                    'btn-navbar-toggle-container btn-toggle-container',
                    sharedState.navbarShow && sharedState.navbarAbsolute
                        ? 'follow-navbar'
                        : '',
                )}
            >
                <Button
                    onClick={handleNavbarToggle}
                    className={classNames('btn-navbar-toggle btn-toggle')}
                    color="default"
                >
                    {sharedState.navbarShow ? (
                        <XIcon className="x-icon" />
                    ) : (
                        <NavbarIcon className="navbar-icon" />
                    )}
                </Button>
            </div>

            <div
                className={classNames(
                    'btn-playlist-toggle-container btn-toggle-container',
                    playlistShow ? 'follow-navbar' : '',
                )}
            >
                <Button
                    onClick={handlePlaylistToggle}
                    className={classNames('btn-playlist-toggle btn-toggle')}
                    color="default"
                >
                    {playlistShow ? (
                        <CaretIconRight className="icon-right" />
                    ) : (
                        <CaretIconLeft className="icon-left" />
                    )}
                </Button>
            </div>

            <h1>Player {serverId}</h1>
            <PlaylistBar hide={!playlistShow} />
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

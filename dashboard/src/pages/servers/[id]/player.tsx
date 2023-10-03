import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavbarIcon from '@/assets/icons/navbar-icon.svg';
import classNames from 'classnames';
import useSharedStateGetter from '@/hooks/useSharedStateGetter';
import CaretIconLeft from '@/assets/icons/caret-outline-left.svg';
import CaretIconRight from '@/assets/icons/caret-outline-right.svg';
import PlaylistBar from '@/components/PlaylistBar';
import XIcon from '@/assets/icons/x-solid.svg';
import SampleThumb from '@/assets/images/sample-thumbnail.png';

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
        <div className="player-page-container">
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

            <div className="main-player-content-container">
                <div className="top-container">
                    <div className="thumbnail-container">
                        <img src={SampleThumb.src} alt="Thumbnail" />
                    </div>
                    <div className="track-info-container">
                        <h1>Player {serverId}</h1>
                        <p>Player {serverId}</p>
                    </div>
                </div>

                <div className="player-control-container">Control</div>
            </div>

            <PlaylistBar hide={!playlistShow} />
        </div>
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

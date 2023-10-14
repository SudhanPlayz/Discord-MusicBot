import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import NavbarIcon from '@/assets/icons/navbar-icon.svg';
import classNames from 'classnames';
import useSharedStateGetter from '@/hooks/useSharedStateGetter';
import CaretIconLeft from '@/assets/icons/caret-outline-left.svg';
import CaretIconRight from '@/assets/icons/caret-outline-right.svg';
import PlaylistBar from '@/components/PlaylistBar';
import XIcon from '@/assets/icons/x-solid.svg';
import SampleThumb from '@/assets/images/sample-thumbnail.png';
import NextIcon from '@/assets/icons/next.svg';
import PauseIcon from '@/assets/icons/pause.svg';
import { playerSocket } from '@/libs/sockets';
import { IGlobalState } from '@/interfaces/globalState';
import globalState from '@/sharedStates/globalState';
import {
    getDocumentDragHandler,
    setElementActive,
    setElementInactive,
} from '@/utils/common';
import { IPlayerEventHandlers } from '@/interfaces/ws';
import { ITrack, ESocketEventType } from '@/interfaces/wsShared';

const sharedStateMount = (sharedState: IGlobalState) => {
    if (sharedState.navbarShow && sharedState.setNavbarShow) {
        sharedState.setNavbarShow(false);
    }
};

const sharedStateUnmount = (sharedState: IGlobalState) => {
    if (!sharedState.navbarShow && sharedState.setNavbarShow) {
        sharedState.setNavbarShow(true);
    }

    if (sharedState.navbarAbsolute && sharedState.setNavbarAbsolute) {
        sharedState.setNavbarAbsolute(false);
    }
};

export const getServerSideProps = () => {
    return {
        props: {},
    };
};

const Player: NextPageWithLayout = () => {
    const router = useRouter();
    const serverId = router.query.id;

    const [playlistShow, setPlaylistShow] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [maxProgressValue, setMaxProgressValue] = useState(100000);
    const [socketLoading, setSocketLoading] = useState(true);
    const [playing, setPlaying] = useState<ITrack | null>(null);
    const [queue, setQueue] = useState<ITrack[] | { dummy?: boolean }[]>([
        {},
        {},
        {},
        {},
        {},
    ]);

    const toSeekProgressValue = useRef<number | undefined>();

    const sharedState = useSharedStateGetter(globalState);

    const handleSeek = () => {
        if (toSeekProgressValue.current == undefined) return;

        // !TODO: send seek event to socket

        setProgressValue(toSeekProgressValue.current);
        toSeekProgressValue.current = undefined;
    };

    const seekerMouseMoveHandler = (e: MouseEvent) => {
        e.preventDefault();

        setProgressValue(
            (e.clientX / document.body.clientWidth) * maxProgressValue,
        );
    };

    const seekerMouseUpHandler = (e: MouseEvent) => {
        const el = e.target as HTMLDivElement | null;
        const seekerEl = document.getElementById('seeker');
        if (!el || !seekerEl) return;

        e.preventDefault();

        el.removeEventListener('mousemove', seekerMouseMoveHandler);
        el.removeEventListener('mouseup', seekerMouseUpHandler);

        setElementInactive(el);
        setElementInactive(seekerEl);
        if (seekerEl.parentElement) setElementInactive(seekerEl.parentElement);

        handleSeek();
    };

    const seekerMouseDownHandler = (e: MouseEvent) => {
        const el = getDocumentDragHandler();
        const seekerEl = document.getElementById('seeker');
        if (!el || !seekerEl) return;

        e.preventDefault();

        toSeekProgressValue.current = progressValue;

        el.addEventListener('mousemove', seekerMouseMoveHandler);
        el.addEventListener('mouseup', seekerMouseUpHandler);

        setElementActive(el);
        setElementActive(seekerEl);
        if (seekerEl.parentElement) {
            setElementActive(seekerEl.parentElement);
        }
    };

    const seekerMount = () => {
        const el = document.getElementById('seeker');

        if (!el) return;

        el.addEventListener('mousedown', seekerMouseDownHandler);
    };

    const seekerUnmount = () => {
        const el = document.getElementById('seeker');

        if (!el) return;

        el.removeEventListener('mousedown', seekerMouseDownHandler);
    };

    const handleQueueUpdateEvent: IPlayerEventHandlers[ESocketEventType.GET_QUEUE] =
        (e) => {
            console.log({ handleQueueUpdateEvent: e });
            setQueue(e.d || []);
        };

    const handlePlayingEvent: IPlayerEventHandlers[ESocketEventType.PLAYING] = (
        e,
    ) => {
        console.log({ handlePlayingEvent: e });
        setPlaying(e.d);
    };

    const handleErrorEvent: IPlayerEventHandlers[ESocketEventType.ERROR] = (
        e,
    ) => {
        console.error({ handleErrorEvent: e });
    };

    const socketEventHandlers: IPlayerEventHandlers = {
        [ESocketEventType.GET_QUEUE]: handleQueueUpdateEvent,
        [ESocketEventType.ERROR]: handleErrorEvent,
        [ESocketEventType.PLAYING]: handlePlayingEvent,
    };

    const handleSocketClose = (e: CloseEvent) => {
        playerSocket.unmount(serverId as string);
        console.log('Reconnecting...');

        playerSocket.mount(serverId as string, {
            mountHandler: {
                close: handleSocketClose,
            },
            eventHandler: socketEventHandlers,
        });
    };

    useEffect(() => {
        sharedStateMount(sharedState);
        seekerMount();

        playerSocket.mount(serverId as string, {
            mountHandler: {
                close: handleSocketClose,
            },
            eventHandler: socketEventHandlers,
        });

        return () => {
            sharedStateUnmount(sharedState);
            seekerUnmount();
            playerSocket.unmount(serverId as string);
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

    const handleProgressClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        e.preventDefault();

        // !TODO: sendSeek((e.clientX / document.body.clientWidth) * maxProgressValue);
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
                        <img
                            src={
                                !playing?.thumbnail?.length
                                    ? SampleThumb.src
                                    : playing.thumbnail
                            }
                            alt="Thumbnail"
                        />
                    </div>
                    <div className="track-info-container">
                        {!playing ? (
                            <h1 className="no-track">
                                Nothing playing in this server
                            </h1>
                        ) : (
                            <>
                                <h1>{playing.title}</h1>
                                <p>{playing.author}</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="player-control-container">
                    <div id="player-progress-bar" onClick={handleProgressClick}>
                        <div
                            className="progress-value"
                            style={{
                                width: `${
                                    (progressValue / maxProgressValue) * 100
                                }%`,
                            }}
                        >
                            <div id="seeker"></div>
                        </div>

                        <div className="remaining-progress"></div>
                    </div>
                    <div
                        aria-busy={socketLoading}
                        aria-describedby="player-progress-bar"
                        className="control-duration-container"
                    >
                        <div className="control-container">
                            <div className="btn-toggle-container">
                                <Button className="btn-toggle">
                                    <NextIcon
                                        style={{
                                            transform: 'rotate(180deg)',
                                        }}
                                    />
                                </Button>
                            </div>
                            <div className="btn-toggle-container">
                                <Button className="btn-toggle">
                                    <PauseIcon />
                                </Button>
                            </div>
                            <div className="btn-toggle-container">
                                <Button className="btn-toggle">
                                    <NextIcon />
                                </Button>
                            </div>
                        </div>
                        <div className="duration-container">03:01 / 03:54</div>
                    </div>
                </div>
            </div>

            <PlaylistBar queue={queue as ITrack[]} hide={!playlistShow} />
        </div>
    );
};

Player.getLayout = (page) => (
    <DashboardLayout
        contentContainerStyle={{
            width: '100%',
            height: '100%',
            display: 'flex',
            zIndex: 0,
            backgroundColor: 'black',
        }}
        layoutContainerProps={{
            display: 'flex',
            height: '100%',
            overflow: 'hidden',
        }}
    >
        {page}
    </DashboardLayout>
);

export default Player;

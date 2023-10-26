import { NextPageWithLayout } from '@/interfaces/layouts';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import NavbarIcon from '@/assets/icons/navbar-icon.svg';
import classNames from 'classnames';
import useSharedStateGetter from '@/hooks/useSharedStateGetter';
import CaretIconLeft from '@/assets/icons/caret-outline-left.svg';
import CaretIconRight from '@/assets/icons/caret-outline-right.svg';
import PlaylistBar from '@/components/PlaylistBar';
import XIcon from '@/assets/icons/x-solid.svg';
import SampleThumb from '@/assets/images/sample-thumbnail.png';
import NextIcon from '@/assets/icons/next.svg';
import PlayIcon from '@/assets/icons/play.svg';
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
import { formatDuration } from '@/utils/formatting';
import {
    emitNext,
    emitPause,
    emitPrevious,
    emitSeek,
} from '@/libs/sockets/player/emit';
import Image from 'next/image';
import { getImageOnErrorHandler } from '@/utils/image';
import useAbortDelay from '@/hooks/useAbortDelay';

const FALLBACK_MAX_PROGRESS_VALUE = 1;
const SOCKET_WAIT_RES_TIMEOUT = 3000;

const formatTrackDuration = (value: number, max: number) => {
    return `${formatDuration(value ?? 0)} / ${formatDuration(max ?? 0)}`;
};

function randomEntry(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomTrack() {
    const titles = [
        'Quacking Duck',
        'EarthQuake',
        'Fish In A Barrel',
        'Shotgun Soy Gun',
        'Bean',
        'The Church',
    ];
    const authors = [
        'Goose',
        'In The Name Of',
        'RTMF',
        'LGTM',
        'Test Author',
        'GSI MS',
    ];
    const durations = [333364, 234423, 13212, 3242533, 2342453, 121231];
    return {
        title: randomEntry(titles),
        author: randomEntry(authors),
        duration: randomEntry(durations),
    };
}

const dummyQueue: ITrack[] = [];
for (let i = 0; i < 25; i++) {
    dummyQueue.push(randomTrack());
}

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
    const [playing, setPlaying] = useState<ITrack | null>(null);
    const [paused, setPaused] = useState<boolean>(true);
    const [mainImgFallback, setMainImgFallback] = useState<boolean>(false);
    const [queue, setQueue] = useState<ITrack[] | { dummy?: boolean }[]>(
        dummyQueue,
    );
    const [progressTooltip, setProgressTooltip] = useState<
        string | undefined
    >();

    const sharedState = useSharedStateGetter(globalState);

    const durationDisplayRef = useRef<HTMLDivElement>(null);

    const progressbarRef = useRef<HTMLDivElement>(null);
    const progressValueRef = useRef<number>(0);
    const toSeekProgressValue = useRef<number | undefined>();

    const {
        reset: resetResetProgress,
        ref: resetProgressRef,
        run: runResetProgress,
    } = useAbortDelay();

    const {
        reset: resetOriginalPaused,
        ref: originalPausedRef,
        run: runOriginalPaused,
    } = useAbortDelay();

    const {
        reset: resetNextBack,
        ref: nextBackRef,
        run: runNextBack,
    } = useAbortDelay();

    const maxProgressValue = useRef<number>(1);

    const isMaxProgressValueEmpty = () =>
        !maxProgressValue.current ||
        maxProgressValue.current === FALLBACK_MAX_PROGRESS_VALUE;

    const setProgressValue = (progressValue: number) => {
        if (progressbarRef.current) {
            progressbarRef.current.style.width = `${
                progressValue && maxProgressValue.current
                    ? (progressValue / maxProgressValue.current) * 100
                    : 0
            }%`;
        }

        if (durationDisplayRef.current) {
            durationDisplayRef.current.textContent = formatTrackDuration(
                progressValue,
                maxProgressValue.current,
            );
        }

        progressValueRef.current = progressValue;
    };

    useEffect(
        () => setProgressValue(progressValueRef.current ?? 0),
        [maxProgressValue],
    );

    const dispatchProgressResetter = (resetTo: number) => {
        runResetProgress(() => {
            setProgressValue(resetTo);
        }, SOCKET_WAIT_RES_TIMEOUT);
    };

    const handleSeek = () => {
        if (
            toSeekProgressValue.current === undefined ||
            resetProgressRef.current
        )
            return;

        emitSeek(progressValueRef.current);

        dispatchProgressResetter(toSeekProgressValue.current);

        toSeekProgressValue.current = undefined;
    };

    const seekerMouseMoveHandler = (e: MouseEvent) => {
        e.preventDefault();

        setProgressValue(
            (e.clientX / document.body.clientWidth) * maxProgressValue.current,
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
        if (
            toSeekProgressValue.current !== undefined ||
            resetProgressRef.current
        )
            return;

        const el = getDocumentDragHandler();
        const seekerEl = document.getElementById('seeker');
        if (!el || !seekerEl) return;

        e.preventDefault();

        toSeekProgressValue.current = progressValueRef.current;

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
            setQueue(e.d || []);
        };

    const handlePlayingEvent: IPlayerEventHandlers[ESocketEventType.PLAYING] = (
        e,
    ) => {
        setPlaying(e.d);
        maxProgressValue.current = e.d?.duration ?? FALLBACK_MAX_PROGRESS_VALUE;
        setProgressValue(0);

        // if (!e.d) setPaused(true);

        if (e.d) resetNextBack();
    };

    const handleProgressEvent: IPlayerEventHandlers[ESocketEventType.PROGRESS] =
        (e) => {
            if (toSeekProgressValue.current !== undefined) return;

            setProgressValue(e.d ?? 0);

            // deploy timeouts to "smooth" the progress move until the next progress event
            // for 2K monitors, value above 3 are a waste of computing power imo
            // significantly higher resolution monitor might benefit with higher value
            const smoothLevel = 3;
            for (let i = 1; i < smoothLevel; i++) {
                const ts = i * (1000 / smoothLevel);
                setTimeout(() => {
                    if (resetProgressRef.current) return;

                    setProgressValue((e.d && e.d + ts) ?? 0);
                }, ts);
            }

            resetResetProgress();
        };

    const handlePauseEvent: IPlayerEventHandlers[ESocketEventType.PAUSE] = (
        e,
    ) => {
        setPaused(!!e.d);

        resetOriginalPaused();
    };

    const handleErrorEvent: IPlayerEventHandlers[ESocketEventType.ERROR] = (
        e,
    ) => {
        console.error(e);
    };

    const socketEventHandlers: IPlayerEventHandlers = {
        [ESocketEventType.GET_QUEUE]: handleQueueUpdateEvent,
        [ESocketEventType.ERROR]: handleErrorEvent,
        [ESocketEventType.PLAYING]: handlePlayingEvent,
        [ESocketEventType.PROGRESS]: handleProgressEvent,
        [ESocketEventType.PAUSE]: handlePauseEvent,
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

        if (
            isMaxProgressValueEmpty() ||
            toSeekProgressValue.current !== undefined ||
            resetProgressRef.current
        )
            return;

        const seekTo =
            e.clientX && maxProgressValue.current
                ? (e.clientX / document.body.clientWidth) *
                  maxProgressValue.current
                : 0;

        emitSeek(seekTo);

        dispatchProgressResetter(progressValueRef.current);
        setProgressValue(seekTo);
    };

    const handleProgressMouseMove: React.MouseEventHandler<HTMLDivElement> = (
        e,
    ) => {
        if (isMaxProgressValueEmpty()) return;

        e.preventDefault();

        const ptEl = document.getElementById('progress-tooltip');

        if (ptEl) {
            ptEl.style.width = `${String(e.clientX * 2)}px`;
        }

        setProgressTooltip(
            formatTrackDuration(
                (e.clientX / document.body.clientWidth) *
                    maxProgressValue.current,
                maxProgressValue.current,
            ),
        );
    };

    const togglePlayPause = () => {
        if (originalPausedRef.current) return;

        const originalPaused = paused;

        const newPaused = !paused;

        emitPause(newPaused);

        runOriginalPaused(() => {
            setPaused(originalPaused);
        }, SOCKET_WAIT_RES_TIMEOUT);

        setPaused(newPaused);
    };

    const handlePrevious = () => {
        if (nextBackRef.current) return;

        emitPrevious();
        runNextBack(() => {}, SOCKET_WAIT_RES_TIMEOUT);
    };

    const handleNext = () => {
        if (nextBackRef.current) return;

        emitNext();
        runNextBack(() => {}, SOCKET_WAIT_RES_TIMEOUT);
    };

    const mainImg = !playing?.thumbnail?.length
        ? SampleThumb.src
        : playing.thumbnail;

    const handleImageError = useCallback(
        getImageOnErrorHandler({
            img: mainImg,
            setImgFallback: (fb: boolean) => setMainImgFallback(fb),
            setNewImg: (newImg: string) => {
                setPlaying((v) => {
                    if (v?.thumbnail?.length) v.thumbnail = newImg;

                    return v;
                });
            },
        }),
        [mainImg],
    );

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
                        <Image
                            src={mainImg}
                            alt="Thumbnail"
                            width={mainImgFallback ? 640 : 1280}
                            height={mainImgFallback ? 480 : 720}
                            style={{
                                objectFit: 'contain',
                            }}
                            onError={handleImageError}
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
                    <Tooltip
                        content={progressTooltip}
                        color="secondary"
                        placement="top"
                        id="progress-tooltip"
                    >
                        <div
                            id="player-progress-bar"
                            onClick={handleProgressClick}
                            onMouseMove={handleProgressMouseMove}
                        >
                            <div
                                ref={progressbarRef}
                                className="progress-value"
                            >
                                <div id="seeker"></div>
                            </div>

                            <div className="remaining-progress"></div>
                        </div>
                    </Tooltip>
                    <div
                        // aria-busy={socketLoading}
                        aria-describedby="player-progress-bar"
                        className="control-duration-container"
                    >
                        <div className="control-container">
                            <div className="btn-toggle-container">
                                <Button
                                    className="btn-toggle"
                                    onClick={handlePrevious}
                                >
                                    <NextIcon
                                        style={{
                                            transform: 'rotate(180deg)',
                                        }}
                                    />
                                </Button>
                            </div>
                            <div className="btn-toggle-container">
                                <Button
                                    className="btn-toggle"
                                    onClick={togglePlayPause}
                                >
                                    {paused ? (
                                        <div className="btn-play">
                                            <PlayIcon />
                                        </div>
                                    ) : (
                                        <PauseIcon />
                                    )}
                                </Button>
                            </div>
                            <div className="btn-toggle-container">
                                <Button
                                    className="btn-toggle"
                                    onClick={handleNext}
                                >
                                    <NextIcon />
                                </Button>
                            </div>
                        </div>
                        <div
                            ref={durationDisplayRef}
                            className="duration-container"
                        ></div>
                    </div>
                </div>
            </div>

            <PlaylistBar
                queue={queue as ITrack[]}
                setQueue={setQueue as ReturnType<typeof useState<ITrack[]>>[1]}
                hide={!playlistShow}
            />
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

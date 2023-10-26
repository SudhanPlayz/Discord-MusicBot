import { IPlaylistBarProps } from '@/interfaces/components/PlaylistBar';
import { Container } from '@nextui-org/react';
import classNames from 'classnames';
import DragHandleIcon from '@/assets/icons/drag-handle.svg';
import { ClassAttributes, DragEvent, useEffect, useRef, useState } from 'react';
import {
    getDocumentDragHandler,
    setElementActive,
    setElementInactive,
} from '@/utils/common';
import { ITrack } from '@/interfaces/wsShared';
import Image from 'next/image';
import { formatDuration, isNumber } from '@/utils/formatting';
import { emitQueueUpdate } from '@/libs/sockets/player/emit';
import useAbortDelay from '@/hooks/useAbortDelay';
// import { useRouter } from 'next/router';

type DragHandler = (event: DragEvent<HTMLDivElement>, idx: number) => void;

interface ITrackProps {
    idx: number;
    dragIdx: number | undefined;

    onDragStart?: DragHandler;
    dragRef: ClassAttributes<HTMLDivElement>['ref'];
    track: ITrack;
}

function Track({ idx, onDragStart, dragIdx, dragRef, track }: ITrackProps) {
    const isDragging = dragIdx === idx;

    const { title, thumbnail, author, duration } = track;

    return (
        <div
            draggable
            className="track-container"
            id={`track-${idx}`}
            onDragStart={(e) => onDragStart?.(e, idx)}
            ref={isDragging ? dragRef : undefined}
        >
            <div
                className={classNames(
                    'drag-overlay',
                    isDragging ? 'active' : '',
                )}
            ></div>
            <div className={classNames('thumb', isDragging ? 'hidden' : '')}>
                <Image
                    src={thumbnail as string}
                    width={1280}
                    height={720}
                    alt="Thumb"
                    style={{
                        objectFit: 'cover',
                        maxHeight: '50px',
                    }}
                />
            </div>
            <div className={classNames('info', isDragging ? 'hidden' : '')}>
                <div className="title">{title}</div>

                <div className="info">
                    {author} •{' '}
                    {duration ? formatDuration(duration) : 'Unknown Duration'}
                </div>
            </div>
            <div
                className={classNames(
                    'drag-container',
                    isDragging ? 'hidden' : '',
                )}
            >
                <DragHandleIcon />
            </div>
        </div>
    );
}

const sleep = (ms: number) => new Promise((r, j) => setTimeout(r, ms));

export default function PlaylistBar({
    queue,
    setQueue,
    hide,
}: IPlaylistBarProps) {
    // const router = useRouter();
    const dragIdx = useRef<number>();
    const [stateDragIdx, setStateDragIdx] = useState<number>();

    const clientY = useRef<number>(-1);
    const playlistBarQueueScroll = useRef<HTMLDivElement>(null);
    const playlistBarQueueContainer = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);

    const dragHandlerEnabled = useRef(false);
    const originalQueue = useRef<ITrack[]>([]);
    const currentQueue = useRef<ITrack[]>([]);

    const disableDragThresholdHandler = () => {
        dragHandlerEnabled.current = false;
        clientY.current = -1;
    };

    const { ref: queRef, reset: resetQue, run: runQue } = useAbortDelay();

    useEffect(() => {
        resetQue();
    }, [queue]);

    /**
     * Get playlistBarQueueScroll rects
     */
    const getRsRects = () =>
        playlistBarQueueScroll.current?.getClientRects()[0];

    /**
     * Get playlistBarQueueContainer rects
     */
    const getRcRects = () =>
        playlistBarQueueContainer.current?.getClientRects()[0];

    const handleTrackQueueMove = (decide: 0 | 1 | 2) => {
        if (!decide || !isNumber(dragIdx.current)) return;

        const newQueue = currentQueue.current.slice();
        const move = newQueue.splice(dragIdx.current, 1)[0];

        if (!move) return;

        switch (decide) {
            case 1:
                newQueue.splice(--dragIdx.current, 0, move);
                break;
            case 2:
                newQueue.splice(++dragIdx.current, 0, move);
                break;
        }

        currentQueue.current = newQueue;
        setQueue(newQueue);
        setStateDragIdx(dragIdx.current);
    };

    const handleTrackDragging = () => {
        if (!isNumber(dragIdx.current)) return;

        const dragRects = dragRef.current?.getClientRects()[0];
        if (!dragRects) return;

        const rs = getRsRects();
        if (!rs) return;

        const hThres = dragRects.height / 4;
        const absY = dragRects.top;

        /**
         * 0: do nothing
         * 1: go to prev
         * 2: go next
         */
        let decide: 0 | 1 | 2 = 0;

        if (
            dragIdx.current > 0 && // can go to previous
            absY - hThres > clientY.current // should go to previous
        ) {
            decide = 1;
        }

        // move track to next position
        else if (
            dragIdx.current < currentQueue.current.length - 1 && // can go to next
            absY + dragRects.height + hThres < clientY.current // should go to next
        ) {
            decide = 2;
        }

        handleTrackQueueMove(decide);
    };

    const handleDragThreshold = async () => {
        if (dragHandlerEnabled.current) return;
        dragHandlerEnabled.current = true;

        const dragRects = dragRef.current?.getClientRects()[0];
        /**
         * how far from edge to start scrolling in pixel
         * 40 is fallback value
         */
        const hThres = dragRects?.height || 40;
        /**
         * scroll step in pixel
         */
        const scrollStep = 12;
        /**
         * sleep time in ms before continue scrolling
         */
        const st = 20;

        let rc, rs;

        // scroll up on top threshold
        while (
            clientY.current !== -1 &&
            (rc = getRcRects()) &&
            (rs = getRsRects()) &&
            clientY.current < rs.top + hThres && // should scroll up
            rs.top > rc.top // can scroll up
        ) {
            const diff = rs.top - rc.top;
            playlistBarQueueScroll.current?.scroll(0, diff - scrollStep);

            await sleep(st);
        }

        // scroll down on bottom threshold
        while (
            clientY.current !== -1 &&
            (rc = getRcRects()) &&
            (rs = getRsRects()) &&
            clientY.current > rs.height + rs.top - hThres && // should scroll down
            rc.height > rs.height - (rc.top - rs.top) // can scroll down
        ) {
            const diff = rs.top - rc.top;
            playlistBarQueueScroll.current?.scroll(0, diff + scrollStep);

            await sleep(st);
        }

        disableDragThresholdHandler();
    };

    const handleDragOver = (e: MouseEvent) => {
        if (queRef.current) return;

        e.preventDefault();

        clientY.current = e.clientY;

        handleTrackDragging();
        handleDragThreshold();
    };

    const handleDragDrop = (e: MouseEvent) => {
        if (queRef.current) return;

        const el = getDocumentDragHandler();

        if (!el) return;

        e.preventDefault();

        disableDragThresholdHandler();

        el.removeEventListener('dragover', handleDragOver);
        el.removeEventListener('drop', handleDragDrop);
        el.removeEventListener('click', handleDragDrop);

        setElementInactive(el);

        dragIdx.current = undefined;
        setStateDragIdx(undefined);

        emitQueueUpdate(currentQueue.current.map((v) => v.id));

        runQue(() => {
            setQueue(originalQueue.current);
            originalQueue.current = [];
        }, 3000);

        currentQueue.current = [];
    };

    const handleDragStart: DragHandler = (e, idx) => {
        if (queRef.current) return;

        const el = getDocumentDragHandler();

        if (!el) return;

        dragIdx.current = idx;
        setStateDragIdx(idx);
        originalQueue.current = queue;
        currentQueue.current = queue;

        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('drop', handleDragDrop);
        el.addEventListener('click', handleDragDrop);

        setElementActive(el);

        e.dataTransfer.setData('text', (e.target as HTMLDivElement).id);
    };

    const trackEvents = {
        onDragStart: handleDragStart,
        dragIdx: stateDragIdx,
        dragRef,
    };

    return (
        <div
            className={classNames(
                'playlistbar-container bar-container',
                hide ? 'hide' : '',
            )}
        >
            <Container
                css={{
                    fontSize: '$xl2',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    padding: 0,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                Up Next
            </Container>
            <div
                ref={playlistBarQueueScroll}
                className="tracks-overflow-container"
            >
                <div
                    ref={playlistBarQueueContainer}
                    className="tracks-container"
                >
                    {queue.map((v, i) => {
                        return (
                            <Track key={i} idx={i} track={v} {...trackEvents} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

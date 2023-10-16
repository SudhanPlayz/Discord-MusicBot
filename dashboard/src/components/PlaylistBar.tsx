import { IPlaylistBarProps } from '@/interfaces/components/PlaylistBar';
import { Container } from '@nextui-org/react';
import classNames from 'classnames';
import SampleThumb from '@/assets/images/sample-thumbnail.png';
import DragHandleIcon from '@/assets/icons/drag-handle.svg';
import { ClassAttributes, DragEvent, useRef, useState } from 'react';
import {
    getDocumentDragHandler,
    setElementActive,
    setElementInactive,
} from '@/utils/common';
// import { useRouter } from 'next/router';

function isNumber(v: any): v is number {
    return typeof v === 'number';
}

type DragHandler = (event: DragEvent<HTMLDivElement>, idx: number) => void;

interface ITrackProps {
    idx: number;
    dragIdx: number | undefined;

    onDragStart?: DragHandler;
    dragRef: ClassAttributes<HTMLDivElement>['ref'];
}

function Track({ idx, onDragStart, dragIdx, dragRef }: ITrackProps) {
    const isDragging = dragIdx === idx;

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
                <img src={SampleThumb.src} alt="Thumb" />
            </div>
            <div className={classNames('info', isDragging ? 'hidden' : '')}>
                <div className="title">Moment Apart</div>

                <div className="info">ODESZA • 3:54</div>
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

export default function PlaylistBar({ queue, hide }: IPlaylistBarProps) {
    // const router = useRouter();
    const dragIdx = useRef<number>();
    const [stateDragIdx, setStateDragIdx] = useState<number>();

    const clientY = useRef<number>(-1);
    const playlistBarQueueScroll = useRef<HTMLDivElement>(null);
    const playlistBarQueueContainer = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);

    const dragHandlerEnabled = useRef(false);

    const disableDragThresholdHandler = () => {
        dragHandlerEnabled.current = false;
        clientY.current = -1;
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
            (rc = playlistBarQueueContainer.current?.getClientRects()[0]) &&
            (rs = playlistBarQueueScroll.current?.getClientRects()[0]) &&
            clientY.current < rs.top + hThres &&
            rs.top > rc.top
        ) {
            const diff = rs.top - rc.top;
            playlistBarQueueScroll.current?.scroll(0, diff - scrollStep);

            await sleep(st);
        }

        // scroll down on bottom threshold
        while (
            clientY.current !== -1 &&
            (rc = playlistBarQueueContainer.current?.getClientRects()[0]) &&
            (rs = playlistBarQueueScroll.current?.getClientRects()[0]) &&
            isNumber(rs.height) &&
            clientY.current > rs.height + rs.top - hThres &&
            isNumber(rc.height) &&
            rc.height > rs.height - (rc.top - rs.top)
        ) {
            const diff = rs.top - rc.top;
            playlistBarQueueScroll.current?.scroll(0, diff + scrollStep);

            await sleep(st);
        }

        disableDragThresholdHandler();
    };

    const handleDragOver = (e: MouseEvent) => {
        e.preventDefault();

        clientY.current = e.clientY;

        handleDragThreshold();
    };

    const handleDragDrop = (e: MouseEvent) => {
        const el = getDocumentDragHandler();

        if (!el) return;

        const eTarget = e.target as HTMLDivElement;

        console.log({
            drop: e,
            dragIdx: dragIdx.current,
            stateDragIdx,
            clientX: e.clientX,
            clientY: e.clientY,
            clientHeight: eTarget.clientHeight,
            // parentRects: e.target.getClientRects()[0],
        });
        console.log({
            playlistBarQueueContainer:
                playlistBarQueueContainer.current?.getClientRects()[0],
            playlistBarQueueScroll:
                playlistBarQueueScroll.current?.getClientRects()[0],
        });

        e.preventDefault();

        disableDragThresholdHandler();

        el.removeEventListener('dragover', handleDragOver);
        el.removeEventListener('drop', handleDragDrop);
        el.removeEventListener('click', handleDragDrop);

        setElementInactive(el);

        dragIdx.current = undefined;
        setStateDragIdx(undefined);
    };

    const handleDragStart: DragHandler = (e, idx) => {
        const el = getDocumentDragHandler();

        if (!el) return;

        const eTarget = e.target as HTMLDivElement;

        console.log({
            dragstart: e,
            idx,
            dragIdx: dragIdx.current,
            stateDragIdx,
            clientX: e.clientX,
            clientY: e.clientY,
            clientHeight: eTarget.clientHeight,
            parentEl: eTarget.parentElement,
        });
        console.log({
            playlistBarQueueContainer:
                playlistBarQueueContainer.current?.getClientRects()[0],
            playlistBarQueueScroll:
                playlistBarQueueScroll.current?.getClientRects()[0],
        });

        dragIdx.current = idx;
        setStateDragIdx(idx);

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
                        return <Track key={i} idx={i} {...trackEvents} />;
                    })}
                </div>
            </div>
        </div>
    );
}

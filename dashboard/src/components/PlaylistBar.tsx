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

export default function PlaylistBar({ queue, hide }: IPlaylistBarProps) {
    // const router = useRouter();
    const dragIdx = useRef<number>();
    const [stateDragIdx, setStateDragIdx] = useState<number>();

    const playlistBarQueueScroll = useRef<HTMLDivElement>(null);
    const playlistBarQueueContainer = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);

    const handleDragOver = (e: MouseEvent) => {
        e.preventDefault();

        const clientX = e.clientX;
        const clientY = e.clientY;

        console.log({
            over: e,
            dragIdx: dragIdx.current,
            stateDragIdx,
            clientX,
            clientY,
            clientHeight: e.target.clientHeight,
            // parentRects: e.target.getClientRects()[0],
        });

        const rc = playlistBarQueueContainer.current?.getClientRects()[0];
        const rs = playlistBarQueueScroll.current?.getClientRects()[0];

        console.log({
            playlistBarQueueContainer: rc,
            playlistBarQueueScroll: rs,
            // dragRects: dragRef.current?.getClientRects(),
        });

        const hThres = 20;

        console.log({ clientY, rctop: rc?.top, rstop: rs?.top });

        if (
            typeof rs?.top === 'number' &&
            clientY < rs.top + hThres &&
            typeof rc?.top === 'number' &&
            rs.top > rc.top
        ) {
            const diff = rs.top - rc.top;
            playlistBarQueueScroll.current?.scroll(0, diff - 10);
        } else if (
            typeof rs?.height === 'number' &&
            clientY > rs.height - hThres &&
            typeof rc?.height === 'number' &&
            // !TODO
            rs.height > rc.height
        ) {
            const diff = rs.top - rc.top;
            playlistBarQueueScroll.current?.scroll(0, diff + 10);
        }
    };

    const handleDragDrop = (e: MouseEvent) => {
        const el = getDocumentDragHandler();

        if (!el) return;

        console.log({
            drop: e,
            dragIdx: dragIdx.current,
            stateDragIdx,
            clientX: e.clientX,
            clientY: e.clientY,
            clientHeight: e.target.clientHeight,
            // parentRects: e.target.getClientRects()[0],
        });
        console.log({
            playlistBarQueueContainer:
                playlistBarQueueContainer.current?.getClientRects()[0],
            playlistBarQueueScroll:
                playlistBarQueueScroll.current?.getClientRects()[0],
        });

        e.preventDefault();

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

        console.log({
            dragstart: e,
            idx,
            dragIdx: dragIdx.current,
            stateDragIdx,
            clientX: e.clientX,
            clientY: e.clientY,
            clientHeight: e.target.clientHeight,
            parentEl: e.target.parentElement,
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

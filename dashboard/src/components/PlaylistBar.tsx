import { IPlaylistBarProps } from '@/interfaces/components/PlaylistBar';
import { Container } from '@nextui-org/react';
import classNames from 'classnames';
import SampleThumb from '@/assets/images/sample-thumbnail.png';
import DragHandleIcon from '@/assets/icons/drag-handle.svg';
import { DragEvent, useRef, useState } from 'react';
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
}

function Track({ idx, onDragStart, dragIdx }: ITrackProps) {
    const isDragging = dragIdx === idx;

    return (
        <div
            draggable
            className="track-container"
            id={`track-${idx}`}
            onDragStart={(e) => onDragStart?.(e, idx)}
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

    const handleDragOver = (e: MouseEvent) => {
        e.preventDefault();

        // e.target.clientHeight
        // e.target.parentElement
        console.log({
            over: e,
            dragIdx: dragIdx.current,
            stateDragIdx,
            clientX: e.clientX,
            clientY: e.clientY,
        });
    };

    const handleDragDrop = (e: MouseEvent) => {
        const el = getDocumentDragHandler();

        if (!el) return;

        // e.target.clientHeight
        // e.target.parentElement
        console.log({
            drop: e,
            dragIdx: dragIdx.current,
            stateDragIdx,
            clientX: e.clientX,
            clientY: e.clientY,
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

        // e.target.clientHeight
        // e.target.parentElement
        console.log({
            dragstart: e,
            idx,
            dragIdx: dragIdx.current,
            stateDragIdx,
            clientX: e.clientX,
            clientY: e.clientY,
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
            <div className="tracks-overflow-container">
                <div className="tracks-container">
                    {queue.map((v, i) => {
                        return <Track key={i} idx={i} {...trackEvents} />;
                    })}
                </div>
            </div>
        </div>
    );
}

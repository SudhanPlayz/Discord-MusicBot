import { IPlaylistBarProps } from '@/interfaces/components/PlaylistBar';
import { Container } from '@nextui-org/react';
import classNames from 'classnames';
import SampleThumb from '@/assets/images/sample-thumbnail.png';
import DragHandleIcon from '@/assets/icons/drag-handle.svg';
import { DragEvent, useRef } from 'react';
// import { useRouter } from 'next/router';

type DragHandler = (event: DragEvent<HTMLDivElement>, idx: number) => void;

interface ITrackProps {
    idx: number;
    dragIdx: ReturnType<typeof useRef<number | undefined>>;

    onDrop?: DragHandler;
    onDragOver?: DragHandler;
    onDragStart?: DragHandler;
}

function Track({ idx, onDrop, onDragOver, onDragStart, dragIdx }: ITrackProps) {
    const isDragging = dragIdx.current !== undefined;

    return (
        <div
            draggable
            className="track-container"
            id={`track-${idx}`}
            onDragStart={(e) => onDragStart?.(e, idx)}
        >
            <div
                onDrop={(e) => onDrop?.(e, idx)}
                onDragOver={(e) => onDragOver?.(e, idx)}
                className={classNames(isDragging ? 'drag-overlay' : '')}
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

export default function PlaylistBar({ hide }: IPlaylistBarProps) {
    // const router = useRouter();

    const dragIdx = useRef<number | undefined>();

    const handleDrop: DragHandler = (e, idx) => {
        console.log({
            drop: e,
            idx,
            dragIdx: dragIdx.current,
        });

        e.preventDefault();

        dragIdx.current = undefined;
    };

    const handlerDragOver: DragHandler = (e, idx) => {
        console.log({
            dragover: e,
            idx,
            dragIdx: dragIdx.current,
        });

        e.preventDefault();
    };

    const handleDragStart: DragHandler = (e, idx) => {
        console.log({
            dragstart: e,
            idx,
            dragIdx: dragIdx.current,
        });

        e.dataTransfer.setData('text', (e.target as HTMLDivElement).id);

        dragIdx.current = idx;
    };

    const trackEvents = {
        onDragStart: handleDragStart,
        onDragOver: handlerDragOver,
        onDrop: handleDrop,
        dragIdx,
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
            <div className="tracks-container">
                <Track idx={0} {...trackEvents} />
                <Track idx={1} {...trackEvents} />
                <Track idx={2} {...trackEvents} />
                <Track idx={3} {...trackEvents} />
                <Track idx={4} {...trackEvents} />
            </div>
        </div>
    );
}

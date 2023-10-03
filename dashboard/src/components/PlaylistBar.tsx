import { IPlaylistBarProps } from '@/interfaces/components/PlaylistBar';
import classNames from 'classnames';
// import { useRouter } from 'next/router';

export default function PlaylistBar({ hide }: IPlaylistBarProps) {
    // const router = useRouter();

    return (
        <div
            className={classNames(
                'playlistbar-container bar-container',
                hide ? 'hide' : '',
            )}
        >
            <div>Track</div>
        </div>
    );
}

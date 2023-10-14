import { ITrack } from '../wsShared';

export interface IPlaylistBarProps {
    queue: ITrack[];
    hide?: boolean;
}

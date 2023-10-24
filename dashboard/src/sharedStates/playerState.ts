import { IPlayerState } from '@/interfaces/playerState';
import SharedState from '@/libs/sharedState';

class PlayerSharedState extends SharedState<IPlayerState> {
    constructor() {
        super();
    }

    copy(state: IPlayerState) {
        return { ...state };
    }
}

const playerState = new PlayerSharedState();

export default playerState;

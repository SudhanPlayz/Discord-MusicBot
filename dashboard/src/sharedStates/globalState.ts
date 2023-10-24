import { IGlobalState } from '@/interfaces/globalState';
import SharedState from '@/libs/sharedState';

class GlobalSharedState extends SharedState<IGlobalState> {
    constructor() {
        super();
    }

    copy(state: IGlobalState) {
        return { ...state };
    }
}

const globalState = new GlobalSharedState();

export default globalState;

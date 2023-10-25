import { Dispatch, SetStateAction } from 'react';

export interface IGetImageOnErrorHandlerOptions {
    img: string;
    setImgFallback: Dispatch<SetStateAction<boolean>>;
    setNewImg: (newImg: string) => void;
}

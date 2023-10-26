import { IGetImageOnErrorHandlerOptions } from '../interfaces/image';

export const getImageOnErrorHandler = ({
    img,
    setImgFallback,
    setNewImg,
}: IGetImageOnErrorHandlerOptions) => {
    return () => {
        const newImg = img.replace('maxresdefault.', 'hqdefault.');

        if (img === newImg) return;

        console.warn('Image fallback:', img);

        setImgFallback(true);
        setNewImg(newImg);
    };
};

import { useProcessData } from '@/hooks/useProcessData';
import { IBaseApiResponse, IUseProcessDataOptions } from '@/interfaces/api';

interface IProcessDataProps<T> extends IUseProcessDataOptions {
    data: IBaseApiResponse<T> | undefined;
    isLoading: boolean;
    children: React.ReactNode;
}

export default function ProcessData<T>({
    data,
    isLoading,
    children,
    ...props
}: IProcessDataProps<T>) {
    const processData = useProcessData(data, isLoading, {
        ...props,
    });

    return processData(children);
}

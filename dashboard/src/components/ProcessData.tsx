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
    loadingComponent,
    failedComponent,
}: IProcessDataProps<T>) {
    const processData = useProcessData(data, isLoading, {
        loadingComponent,
        failedComponent,
    });

    return processData(children);
}

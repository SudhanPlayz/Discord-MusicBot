import { AppPropsWithLayout } from '@/interfaces/layouts';
import AppLayout from '@/layouts/AppLayout';
import queryClient from '@/libs/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <QueryClientProvider client={queryClient}>
            <AppLayout>{getLayout(<Component {...pageProps} />)}</AppLayout>
        </QueryClientProvider>
    );
}

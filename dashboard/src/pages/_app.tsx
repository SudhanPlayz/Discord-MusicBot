import { AppPropsWithLayout } from '@/interfaces/layouts';
import AppLayout from '@/layouts/AppLayout';

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page);

    return <AppLayout>{getLayout(<Component {...pageProps} />)}</AppLayout>;
}

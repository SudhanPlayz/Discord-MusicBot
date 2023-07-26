import { AppProps } from 'next/app';

export interface NextPageWithLayout<T = {}> extends React.FC<T> {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export interface IPageLayoutProps {
    children: React.ReactNode;
}

export type PageLayout = React.FC<IPageLayoutProps>;

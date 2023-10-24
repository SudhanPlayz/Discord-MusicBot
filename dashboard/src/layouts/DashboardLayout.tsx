import { PageLayout } from '@/interfaces/layouts';
import Navbar from '@/components/navbar';
import useAuthGuard from '@/hooks/useAuthGuard';
import { INavbarProps } from '@/interfaces/components/Navbar';

interface IDashboardLayoutProps {
    navbarProps?: INavbarProps;
    layoutContainerProps?: React.HTMLAttributes<HTMLDivElement>['style'];
}

const DashboardLayout: PageLayout<IDashboardLayoutProps> = ({
    children,
    contentContainerStyle = {
        paddingLeft: '50px',
        paddingRight: '50px',
        paddingTop: '30px',
        paddingBottom: '50px',
    },
    navbarProps = {},
    layoutContainerProps = {
        display: 'flex',
        height: '100%',
        overflow: 'auto',
    },
}) => {
    useAuthGuard();

    return (
        <div style={layoutContainerProps}>
            <Navbar {...navbarProps} />
            <div style={contentContainerStyle}>{children}</div>
        </div>
    );
};

export default DashboardLayout;

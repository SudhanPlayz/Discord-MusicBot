import { PageLayout } from '@/interfaces/layouts';
import Navbar from '@/components/navbar';
import useAuthGuard from '@/hooks/useAuthGuard';
import { INavbarProps } from '@/interfaces/components/Navbar';

interface IDashboardLayoutProps {
    navbarProps?: INavbarProps;
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
}) => {
    useAuthGuard();

    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <Navbar {...navbarProps} />
            <div style={contentContainerStyle}>{children}</div>
        </div>
    );
};

export default DashboardLayout;

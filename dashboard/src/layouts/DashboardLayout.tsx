import { PageLayout } from '@/interfaces/layouts';
import Navbar from '@/components/navbar';
import useAuthGuard from '@/hooks/useAuthGuard';

const DashboardLayout: PageLayout = ({ children }) => {
    useAuthGuard();

    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                overflow: 'auto',
            }}
        >
            <Navbar />
            <div
                style={{
                    paddingLeft: '50px',
                    paddingRight: '50px',
                    paddingTop: '30px',
                    paddingBottom: '50px',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;

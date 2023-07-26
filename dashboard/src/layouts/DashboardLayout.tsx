import { PageLayout } from '@/interfaces/layouts';
import Navbar from '@/components/navbar';

const DashboardLayout: PageLayout = ({ children }) => {
    return (
        <div
            style={{
                display: 'flex',
                gap: '50px',
                height: '100%',
                overflow: 'auto',
            }}
        >
            <Navbar />
            <div
                style={{
                    marginTop: '30px',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;

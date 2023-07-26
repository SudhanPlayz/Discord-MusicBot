import { PageLayout } from '@/interfaces/layouts';
import { createTheme, NextUIProvider } from '@nextui-org/react';

const AppLayout: PageLayout = ({ children }) => {
    return (
        <NextUIProvider
            theme={createTheme({
                type: 'dark',
            })}
            disableBaseline={true}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {children}
            </div>
        </NextUIProvider>
    );
};

export default AppLayout;

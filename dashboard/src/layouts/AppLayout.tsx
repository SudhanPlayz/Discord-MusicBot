import { PageLayout } from '@/interfaces/layouts';
import { createTheme, NextUIProvider } from '@nextui-org/react';

const AppLayout: PageLayout = ({
    children,
    contentContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    },
}) => {
    return (
        <NextUIProvider
            theme={createTheme({
                type: 'dark',
                theme: {
                    colors: {
                        serverCardGray: '#C3C3C5',
                        gray4: '#E2DEE9',
                    },
                },
            })}
        >
            <div style={contentContainerStyle}>{children}</div>
        </NextUIProvider>
    );
};

export default AppLayout;

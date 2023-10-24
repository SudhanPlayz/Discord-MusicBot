import { Card, Container, CSS } from "@nextui-org/react";

interface IHalfContainerProps {
    children: React.ReactNode;
    containerProps?: CSS;
}

export function HalfContainer({ children, containerProps = {} }: IHalfContainerProps) {
    return (
        <Container
            css={{
                display: 'flex',
                gap: '28px',
                height: '50%',
                padding: 0,
                fontSize: '14px',
                fontWeight: 600,
                ...containerProps,
            }}
        >
            {children}
        </Container>
    );
}

export function HalfContainerCard({ children }: IHalfContainerProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '50%',
                flexGrow: 1,
            }}
        >
            <Card
                css={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                }}
            >
                {children}
            </Card>
        </div>
    );
}
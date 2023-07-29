import { Button, Link, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter();

    const pathIs = (path: string) => router.pathname === path;

    return (
        <div
            style={{
                height: '100%',
                width: '250px',
                minWidth: '250px',
                backgroundColor: '#16181A',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                paddingTop: '50px',
                position: 'sticky',
                top: 0,
            }}
        >
            <Link
                css={{
                    fontSize: '$xl2',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#fff',
                }}
                onPress={() => router.push('/')}
            >
                Discord Music Bot
            </Link>
            <Button
                css={{
                    background: pathIs('/dashboard') ? '$primary' : '$gray100',
                }}
                onPress={() => router.push('/dashboard')}
                style={{ marginBottom: '10px' }}
            >
                Dashboard
            </Button>
            <Button
                css={{
                    background: pathIs('/servers') ? '$primary' : '$gray100',
                }}
                color="default"
                onPress={() => router.push('/servers')}
                style={{ marginBottom: '10px' }}
            >
                Servers
            </Button>
            <Spacer />
            <Button
                color="error"
                flat
                onPress={() => router.push('/logout')}
                style={{ marginBottom: '10px' }}
            >
                Logout
            </Button>
        </div>
    );
}

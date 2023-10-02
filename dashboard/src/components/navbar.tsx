import useSharedStateSetter from '@/hooks/useSharedStateSetter';
import { INavbarProps } from '@/interfaces/components/Navbar';
import { Button, Link, Spacer } from '@nextui-org/react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Navbar({}: INavbarProps) {
    const router = useRouter();
    const [show, setShow] = useState<boolean | undefined>(true);
    const [absolute, setAbsolute] = useState<boolean | undefined>(false);

    useSharedStateSetter(
        ['navbarShow', show],
        ['setNavbarShow', setShow],
        ['navbarAbsolute', absolute],
        ['setNavbarAbsolute', setAbsolute],
    );

    const pathIs = (path: string) => router.pathname === path;

    return (
        <div
            className={classNames(
                'navbar-container',
                !show ? 'hide' : '',
                absolute ? 'absolute' : '',
            )}
        >
            <Link
                css={{
                    fontSize: '$xl2',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                }}
                onClick={() => router.push('/')}
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

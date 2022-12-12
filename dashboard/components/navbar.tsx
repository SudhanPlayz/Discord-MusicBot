import {Button, Link, Spacer} from "@nextui-org/react";
import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();

    return <div style={ {
        height: '100%',
        width: '250px',
        backgroundColor: '#16181A',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: '50px',
        marginRight: '50px',
    } }>
        <Link css={ {
            fontSize: '$xl2',
            fontWeight: 'bold',
            marginBottom: '30px',
            color: '#fff',
        } } href='/'>Discord Music Bot</Link>
        <Button css={ {background: router.pathname == '/dashboard' ? '$primary' : '$gray100'} }
                onClick={ () => window.location.pathname = '/dashboard' } style={ {marginBottom: '10px'} }>Dashboard</Button>
        <Button css={ {background: router.pathname == '/servers' ? '$primary' : '$gray100'} } color='default'
                onClick={ () => window.location.pathname = '/servers' } style={ {marginBottom: '10px'} }>Servers</Button>
        <Spacer/>
        <Button color='error' flat onClick={ () => window.location.pathname = '/logout' }
                style={ {marginBottom: '10px'} }>Logout</Button>
    </div>
}

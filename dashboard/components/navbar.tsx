import { Button, Spacer } from "@nextui-org/react";
import Link from "next/link";

export default function Navbar(){
    return <div style={{
        height: '100%',
        width: '200px',
        backgroundColor: '#1f1f1f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '10px',
    }}>
        <h3 style={{
            marginBottom: '30px'
        }}>Discord Music Bot</h3>
        <Link href="/dashboard" ><a style={{
            marginBottom: '10px'
        }}>
            <Button>Dashboard</Button>
        </a></Link>
        <Link href="/servers" ><a>
            <Button>Servers</Button>
        </a></Link>
        <Spacer/>
        <Link href="/logout" ><a>
            <Button shadow color="error">Logout</Button>
        </a></Link>
    </div>
}
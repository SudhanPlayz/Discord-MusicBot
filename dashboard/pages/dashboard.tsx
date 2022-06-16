import Head from "next/head";
import {
    RocketLaunchRounded,
    PersonRounded,
    DnsRounded,
    AudiotrackRounded
} from "@mui/icons-material"
import Content from "../components/content";

const Dashboard = (_props: any) => {
    return (<Content>
        <Head>
            <title>Dashboard</title>
        </Head>

        <h1>Dashboard</h1>
        <div style={{
            display: 'flex',
        }}>
            <div style={{
                display: 'flex',
                width: '200px',
                background: '#1b1b1b',
                padding: '10px',
                margin: '10px',
                borderRadius: '5px',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div>
                    <h4>Commands Ran</h4>
                    <h3>0</h3>
                </div>
                <RocketLaunchRounded fontSize="large" style={{
                    marginLeft: '10px',
                }} />
            </div>

            <div style={{
                display: 'flex',
                width: '200px',
                background: '#1b1b1b',
                padding: '10px',
                margin: '10px',
                borderRadius: '5px',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div>
                    <h4>Users</h4>
                    <h3>0</h3>
                </div>
                <PersonRounded fontSize="large" style={{
                    marginLeft: '30px',
                }} />
            </div>

            <div style={{
                display: 'flex',
                width: '200px',
                background: '#1b1b1b',
                padding: '10px',
                margin: '10px',
                borderRadius: '5px',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div>
                    <h4>Servers</h4>
                    <h3>0</h3>
                </div>
                <DnsRounded fontSize="large" style={{
                    marginLeft: '30px',
                }} />
            </div>

            <div style={{
                display: 'flex',
                width: '200px',
                background: '#1b1b1b',
                padding: '10px',
                margin: '10px',
                borderRadius: '5px',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div>
                    <h4>Songs Played</h4>
                    <h3>0</h3>
                </div>
                <AudiotrackRounded fontSize="large" style={{
                    marginLeft: '30px',
                }} />
            </div>
        </div>
    </Content>)
}

export default Dashboard
import Head from "next/head";
import {
    RocketLaunchRounded,
    PersonRounded,
    DnsRounded,
    AudiotrackRounded
} from "@mui/icons-material"
import Content from "../components/content";
import StatCard from "../components/StatCard";

const Dashboard = (_props: any) => {
    return (<Content>
        <Head>
            <title>Dashboard | Discord Music Bot</title>
        </Head>

        <h1>Dashboard</h1>
        <div style={{
            display: 'flex',
        }}>
            <StatCard title='Commands Ran' amount='0' icon={
                <RocketLaunchRounded fontSize="large"/>}
            />
            <StatCard title='Users' amount='0' icon={
                <PersonRounded fontSize="large"/>}
            />
            <StatCard title='Servers' amount='0' icon={
                <DnsRounded fontSize="large"/>}
            />

            <StatCard title='Songs Played' amount='0' icon={
                <AudiotrackRounded fontSize="large"/>}
            />
        </div>
    </Content>)
}

export default Dashboard
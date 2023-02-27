import Head from "next/head";
import {AudiotrackRounded, DnsRounded, PersonRounded, RocketLaunchRounded} from "@mui/icons-material"
import Content from "../components/content";
import StatCard from "../components/StatCard";
import {useEffect, useState} from "react";
import {getDashboard, IDashboard} from "../utils/dashboard";

const Dashboard = (_props: any) => {
    const [data, setData] = useState<IDashboard | null>(null)

    useEffect(() => {
        getDashboard().then(setData);
    }, []);

    return (<Content>
        <Head>
            <title>Dashboard | Discord Music Bot</title>
        </Head>

        <h1>Dashboard</h1>
        <div style={ {
            display: 'flex',
        } }>
            <StatCard title='Commands Ran' amount={ data ? data.commandsRan : "Loading" } icon={
                <RocketLaunchRounded fontSize="large"/> }
            />
            <StatCard title='Users' amount={ data ? data.users : "Loading" } icon={
                <PersonRounded fontSize="large"/> }
            />
            <StatCard title='Servers' amount={ data ? data.servers : "Loading" } icon={
                <DnsRounded fontSize="large"/> }
            />

            <StatCard title='Songs Played' amount={ data ? data.songsPlayed : "Loading" } icon={
                <AudiotrackRounded fontSize="large"/> }
            />
        </div>
    </Content>)
}

export default Dashboard

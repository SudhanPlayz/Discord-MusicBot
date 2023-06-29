import Head from "next/head";
import Server from "../components/server";
import Content from "../components/content";
import { apiCall } from "../utils/serviceCall";

export default function Servers(_props: any) {
    // @todo
    const servers = apiCall("GET", "/servers")
    console.log(servers)

    return <Content>
        <Head>
            <title>Servers | Discord Music Bot</title>
        </Head>
        <h1>Select a server</h1>
        <div style={ {
            display: 'flex',
        } }>
            <Server
                icon="https://cdn.discordapp.com/icons/855346696258060338/93317b7b5c163ecaa21ed16db455066f.png?size=4096"
                name="Coding with amogus" id=";-;"/>
            <Server
                icon="https://cdn.discordapp.com/icons/855346696258060338/93317b7b5c163ecaa21ed16db455066f.png?size=4096"
                name="Coding with amogus" id=";-;"/>
            <Server
                icon="https://cdn.discordapp.com/icons/855346696258060338/93317b7b5c163ecaa21ed16db455066f.png?size=4096"
                name="Coding with amogus" id=";-;"/>
        </div>
    </Content>
}
import Head from "next/head";
import Content from "../../components/content";

export default function Server(_props: any) {
    let server = {
        name: "Amongus",
        id: "137984839",
        icon: "https://cdn.discordapp.com/icons/855346696258060338/93317b7b5c163ecaa21ed16db455066f.png?size=4096",
        loop: {
            song: true,
            queue: false
        },
        queue: [],
        playing: {
            title: "nice song",
            duration: 4000000000,
            currentTime: 3000
        }
    }

    return (
        <Content>
            <Head>
                <title>{ server.name }</title>
            </Head>
            <h1>{ server.name }</h1>
        </Content>
    );
}
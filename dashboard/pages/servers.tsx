import Head from "next/head";
import { useEffect, useState } from "react";
import Server from "../components/server";
import Content from "../components/content";
import { apiCall } from "../utils/serviceCall";

interface IServer {
  id: string;
  icon: string;
  name: string;
}

export default function Servers(_props: any) {
  const [servers, setServers] = useState<IServer[]>()

  useEffect(() => {
    async function getServerList() {
      const servers = (await apiCall("GET", "/servers")).data.servers
      setServers(servers)
    }
    getServerList()
  }, [])

  return (
    <Content>
      <Head>
        <title>Servers | Discord Music Bot</title>
      </Head>
      <h1>Select a server</h1>
      <div style={{
        display: 'flex',
      }}>
        {servers?.map((server) => <Server key={server.id} id={server.id} icon={server.icon} name={server.name} />)}
      </div>
    </Content>
  )
}
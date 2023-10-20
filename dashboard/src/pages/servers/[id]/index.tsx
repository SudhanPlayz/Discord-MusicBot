import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    Avatar,
    Button,
    Card,
    Container,
    Text,
    Tooltip,
} from '@nextui-org/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { NextPageWithLayout } from '@/interfaces/layouts';
import { useGetServer } from '@/services/api';
import { getQueryData } from '@/utils/query';
import ProcessData from '@/components/ProcessData';
import type { AxiosError } from 'axios';
import Image from 'next/image';
import PlayerIcon from '@/assets/icons/play-button.png';
import ConfigIcon from '@/assets/icons/config-button.png';
import { HalfContainer, HalfContainerCard } from '@/components/containers';

interface IMainButtonProps {
    children: React.ReactNode;
    tooltipContent: React.ReactNode;
    onClick?: () => void;
}

function MainButton({ children, tooltipContent, onClick }: IMainButtonProps) {
    return (
        <div
            style={{
                display: 'flex',
                width: '100px',
                height: '100px',
            }}
            onClick={onClick}
        >
            <Tooltip
                content={tooltipContent}
                style={{
                    width: '100%',
                }}
                color="invert"
                placement="bottom"
            >
                <Card
                    css={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: '$primary',
                        },
                    }}
                >
                    {children}
                </Card>
            </Tooltip>
        </div>
    );
}

function Loading() {
    return (
        <>
            <Head>
                <title>Discord Music Bot</title>
            </Head>
            <h1>Loading...</h1>
        </>
    );
}

function Failed({ error }: { error?: AxiosError }) {
    const router = useRouter();

    const back = () => {
        router.push('/servers');
    };

    if (error?.response?.status === 404)
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                }}
            >
                <h1>Bot isn&apos;t in the server, it&apos;s gone!</h1>

                <div>
                    <Button shadow size={'lg'} onClick={back}>
                        Return to server list
                    </Button>
                </div>
            </div>
        );

    return <h1>Failed to fetch server data</h1>;
}

const Server: NextPageWithLayout = () => {
    const router = useRouter();
    const serverId = router.query.id;
    const { data, isLoading, error } = useGetServer(serverId as string);

    console.log('server:', data);

    const { id, name, icon, owner, roles, channels, members, player } =
        getQueryData(data) || {};

    const handlePlayerClick = () => {
        router.push('/servers/' + serverId + '/player');
    };

    const handleConfigClick = () => {
        // router.push somewhere
    };

    return (
        <ProcessData
            {...{ data, isLoading }}
            loadingComponent={<Loading />}
            failedComponent={<Failed error={error as AxiosError} />}
        >
            <Head>
                <title>{name} | Discord Music Bot</title>
            </Head>
            <Container
                css={{
                    paddingTop: '10px',
                    paddingBottom: '20px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    backgroundColor: '$primary',
                    display: 'flex',
                    gap: '20px',
                }}
            >
                <div>
                    <Avatar
                        src={icon}
                        css={{
                            size: 90,
                        }}
                        color="gradient"
                        bordered
                        pointer
                    />
                </div>

                <Text
                    css={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    size={40}
                    weight="semibold"
                >
                    {name}
                </Text>
            </Container>
            <Container
                css={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    paddingLeft: '50px',
                    paddingRight: '50px',
                    paddingTop: '30px',
                    paddingBottom: '50px',
                }}
            >
                <HalfContainer>
                    <MainButton
                        tooltipContent="Player"
                        onClick={handlePlayerClick}
                    >
                        <Image
                            src={PlayerIcon}
                            alt="Player Icon"
                            width={53}
                            height={53}
                        />
                    </MainButton>
                    <MainButton
                        tooltipContent="Config"
                        onClick={handleConfigClick}
                    >
                        <Image
                            src={ConfigIcon}
                            alt="Config Icon"
                            width={53}
                            height={53}
                        />
                    </MainButton>
                </HalfContainer>
                <HalfContainer>
                    <HalfContainerCard>
                        <div>Queue Stats</div>
                        <div>
                            {
                                'Currently playing song, it’s cover image, how many songs are currently in the queue (Take from the /nowplaying, /queue commands), When this card is clicked on -> send to the player'
                            }
                        </div>
                    </HalfContainerCard>
                </HalfContainer>
            </Container>
        </ProcessData>
    );
};

Server.getLayout = (page) => (
    <DashboardLayout
        contentContainerStyle={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 0,
            backgroundColor: 'black',
        }}
    >
        {page}
    </DashboardLayout>
);

export default Server;

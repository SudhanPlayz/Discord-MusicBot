import {AudiotrackRounded, SettingsRounded, YouTube} from '@mui/icons-material'
import {Button, Card, Container, Link, Text} from '@nextui-org/react'
import Head from 'next/head'
import {useEffect, useState} from 'react'
import {getData, IData} from '../utils/data'

const Home = (_props: any) => {
    const [data, setData] = useState<IData | null>(null)

    useEffect(() => {
	    getData().then(res => {
		    setData(res);
		    if (res.redirect?.length) window.location.href = res.redirect;
	    })
    }, [])

    return (
        <Container>
            <Head>
                <title>Discord Music Bot</title>
            </Head>
            <Container css={ {
                display: 'flex',
                alignItems: 'center',
                background: '$gray50',
                position: 'fixed',
                padding: '20px',
                minWidth: '100%',
                left: '0',
                top: '0',
                zIndex: '$5'
            } }>
                <Link css={ {fontSize: '$xl', fontWeight: '$semibold'} } href='/'>
                    { data ? data.name : "Discord Music Bot" }
                </Link>
                <Link color='text' css={ {fontSize: '$lg', fontWeight: '$medium', marginLeft: '20px'} } href='#'>
                    Home
                </Link>
                <Link color='text' css={ {fontSize: '$lg', fontWeight: '$medium', marginLeft: '20px'} }
                      href='#features'>
                    Features
                </Link>
                <Button onClick={ () => window.location.pathname = '/dashboard' } css={ {marginLeft: 'auto'} } auto shadow>
                    Dashboard
                </Button>
            </Container>
            <Container style={ {
                textAlign: 'center',
                marginTop: '1rem',
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            } }>
                <Text h1 css={ {textGradient: "180deg, $blue600 -20%, $blue800 100%",} }>Discord Music Bot</Text>
                <Text h3 css={ {color: '$gray800'} }>An advanced discord music bot, supports Spotify, SoundCloud,
                    YouTube with Shuffling, Volume Control and Web Dashboard!</Text>
                <Container css={ {display: 'flex', alignItems: 'center', justifyContent: 'center'} }>
                    <Button color="primary" onClick={ () => window.location.pathname = '/login' } shadow style={ {
                        marginTop: '1rem'
                    } }>Login
                    </Button>
                    <Button color="primary" flat
                            onClick={ () => window.open('https://github.com/SudhanPlayz/Discord-MusicBot') } style={ {
                        marginTop: '1rem',
                        marginLeft: '20px'
                    } }>Github
                    </Button>
                </Container>
            </Container>
            <Container css={ {display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh'} }>
                <Text h2>Features</Text>
                <Container css={ {display: 'flex', justifyContent: 'center', flexWrap: 'wrap'} }>
                    <Card isHoverable css={ {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '10px',
                        width: '300px',
                        padding: '20px',
                        textAlign: 'center'
                    } }>
                        <YouTube style={ {fontSize: '150px', color: '#3694FF'} }/>
                        <Text h3>Spotify, Soundcloud, and Youtube support</Text>
                        <Text css={ {color: '$gray800'} }>
                            Use your spotify playlist, youtube videos, youtube playlists
                            and much more using this bot
                        </Text>
                    </Card>
                    <Card isHoverable css={ {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '10px',
                        width: '300px',
                        padding: '20px',
                        textAlign: 'center'
                    } }>
                        <AudiotrackRounded style={ {fontSize: '150px', color: '#3694FF'} }/>
                        <Text h3>Lag-free Music</Text>
                        <Text css={ {color: '$gray800'} }>
                            This bot will never lag when playing any song in a voice channel
                        </Text>
                    </Card>
                    <Card isHoverable css={ {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '10px',
                        width: '300px',
                        padding: '20px',
                        textAlign: 'center'
                    } }>
                        <SettingsRounded style={ {fontSize: '150px', color: '#3694FF'} }/>
                        <Text h3>Server Settings</Text>
                        <Text css={ {color: '$gray800'} }>
                            Control your song looping song or queue, play or pause your song easily, or stop the bot
                            completely.
                        </Text>
                    </Card>
                </Container>
            </Container>
            <Container css={ {
                marginTop: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '60vh'
            } }>
                <Text h2>What are you waiting for?</Text>
                <Button shadow size={ 'md' } css={ {marginTop: '5em'} }>Start Now</Button>
            </Container>
        </Container>
    )
}


export default Home 

import { Container, Text, Button } from '@nextui-org/react'
import Head from 'next/head'
import Link from 'next/link'

const Home = (_props: any) => {
  return (
    <Container>
      <Head>
        <title>Discord Music Bot</title>
      </Head>

      <Container style={{
        textAlign: 'center',
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <Text h1>There is no landing page yet.</Text>
        <Text h6>This UI/UX is not completed fully, If you like to help with this go to <a href="https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5/dashboard">v5/dashboard</a> and pull request your commits.</Text>
        <Link href="/login" style={{
          fontSize: '1.1rem'
        }}><a>
            <Button shadow color="gradient" style={{
              marginTop: '1rem'
            }}>
              <span style={{
                color: 'white'
              }}>Login</span>
            </Button>
          </a>
        </Link>
      </Container>
    </Container>
  )
}


export default Home 
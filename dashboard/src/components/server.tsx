import {
    Avatar,
    Button,
    Card,
    Container,
    Text,
    Tooltip,
} from '@nextui-org/react';
import { useRouter } from 'next/router';

interface IProps {
    icon?: string;
    name: string;
    id: string;
    mutual: boolean;
}

export default function Server({ name, icon, id, mutual }: IProps) {
    const router = useRouter();

    const buttonRedir = mutual
        ? '/servers/' + id
        : `/invite?redirect_uri=${encodeURIComponent(window.location.href)}`;

    const handlePress = () => router.push(buttonRedir);

    return (
        <div
            style={{
                display: 'flex',
                maxWidth: '200px',
            }}
        >
            <Card
                key={id}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Container
                    css={{
                        minHeight: '68px',
                        backgroundColor: '$primary',
                        padding: '0px',
                    }}
                ></Container>
                <div
                    style={{
                        display: 'flex',
                        position: 'relative',
                        justifyContent: 'center',
                        paddingTop: '24px',
                        paddingBottom: '24px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        flexGrow: 1,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            transform: 'translateY(-50%)',
                        }}
                    >
                        <Tooltip content={name} color="secondary">
                            <Avatar
                                src={icon}
                                alt="Server Icon"
                                color={'gradient'}
                                bordered
                                pointer
                                css={{
                                    filter: mutual ? '' : 'grayscale(90%)',
                                    size: '48px',
                                }}
                            />
                        </Tooltip>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexDirection: 'column',
                            flexGrow: 1,
                            overflowX: 'hidden',
                        }}
                    >
                        <Text
                            size={16}
                            weight="semibold"
                            css={{
                                textAlign: 'center',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {name}
                        </Text>
                        <Text
                            color="$serverCardGray"
                            css={{
                                flexGrow: 1,
                                textAlign: 'center',
                            }}
                        >
                            Lorem ipsum dolor sit amet
                        </Text>
                    </div>
                </div>

                <Button
                    css={{
                        height: 'fit-content',
                        lineHeight: 'inherit',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '16px',
                        paddingBottom: '16px',
                        border: '0px',
                        borderTop: '0.5px solid $gray4',
                        borderRadius: '0px',
                        background: '$gray',
                        '&:hover': {
                            background: '$primary',
                        },
                    }}
                    onPress={handlePress}
                >
                    {mutual ? 'Manage' : 'Invite'}
                </Button>
            </Card>
        </div>
    );
}

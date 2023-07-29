import { Avatar, Tooltip } from '@nextui-org/react';
import Link from 'next/link';

interface IProps {
    icon?: string;
    name: string;
    id: string;
    mutual: boolean;
}

export default function Server({ name, icon, id, mutual }: IProps) {
    return (
        <div
            key={id}
            style={{
                margin: '10px',
            }}
        >
            <Link
                href={
                    mutual
                        ? '/servers/' + id
                        : `/invite?redirect_uri=${encodeURIComponent(
                              window.location.href,
                          )}`
                }
            >
                <Tooltip content={name} color="secondary">
                    <Avatar
                        src={icon}
                        alt="Server Icon"
                        size="xl"
                        color={'gradient'}
                        bordered
                        pointer
                        css={{
                            filter: mutual ? '' : 'grayscale(90%)',
                        }}
                    />
                </Tooltip>
            </Link>
        </div>
    );
}

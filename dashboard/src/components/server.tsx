import { Avatar, Tooltip } from '@nextui-org/react';
import Link from 'next/link';

interface IProps {
    icon?: string;
    name: string;
    id: string;
}

export default function Server(props: IProps) {
    return (
        <div
            key={props.id}
            style={{
                margin: '10px',
            }}
        >
            <Link href={'/servers/' + props.id}>
                <Tooltip content={props.name} color="secondary">
                    <Avatar
                        src={props.icon}
                        alt="Server Icon"
                        size="xl"
                        color={'gradient'}
                        bordered
                        pointer
                    />
                </Tooltip>
            </Link>
        </div>
    );
}

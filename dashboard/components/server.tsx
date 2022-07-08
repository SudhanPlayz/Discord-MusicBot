import {Avatar, Tooltip} from "@nextui-org/react";
import Link from "next/link";

interface IProps {
    icon: string;
    name: string;
    id: string;
}

const getColor = () => {
    let c = ["gradient", "primary", "secondary", "error", "warning"]
    return c[Math.floor(Math.random() * c.length)];
}

export default function Server(props: IProps) {
    return <div key={ props.id } style={ {
        margin: "10px"
    } }>
        <Link href={ "/servers/" + props.id }><a>
            <Tooltip content={ props.name } color="secondary">
                <Avatar
                    src={ props.icon }
                    size="xl"
                    //@ts-ignore
                    color={ getColor() }
                    bordered
                    pointer
                />
            </Tooltip>
        </a></Link>
    </div>
}
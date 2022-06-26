import {Card, Text} from "@nextui-org/react";
import {ReactNode} from "react";

export default function StatCard(props: {
    title: string;
    amount: number | string;
    icon: ReactNode;
}) {
    return (
        <Card variant="flat" isHoverable css={ {margin: '10px', width: '200px', padding: '15px'} }>
            <Card.Body css={ {display: 'flex', padding: '0', alignItems: 'center', flexDirection: 'row'} }>
                <div style={ {marginRight: 'auto'} }>
                    <Text h4 css={ {color: 'GrayText'} }>{ props.title }</Text>
                    <Text h3>{ props.amount }</Text>
                </div>
                { props.icon }
            </Card.Body>
        </Card>
    )
}
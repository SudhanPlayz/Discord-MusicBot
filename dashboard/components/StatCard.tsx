import { Card, Text } from "@nextui-org/react";

// I'm not that familiar with TypeScript, so you should probably add the interface parts, but allow it to accept React Components.
export default function StatCard(props){
    return(
        <Card variant="flat" isHoverable css={{margin: '10px', width: '200px', padding: '15px'}}>
          <Card.Body css={{ display: 'flex', padding: '0', alignItems: 'center', flexDirection: 'row'}}>
            <div style={{marginRight: 'auto'}}>
                <Text h4 css={{color: 'GrayText'}}>{props.title}</Text>
                <Text h3>{props.amount}</Text>
            </div>
            {props.icon}
          </Card.Body>
        </Card>
    )
}
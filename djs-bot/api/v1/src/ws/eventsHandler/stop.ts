import { ESocketEventType } from '../../interfaces/wsShared';
import { createEventPayload, wsPublish } from '../../utils/ws';

export default function handleStop({ guildId }: { guildId: string }) {
  if (!guildId?.length) throw new TypeError('Missing guildId');

  const to = 'player/' + guildId;
  const d = createEventPayload(ESocketEventType.PLAYING, null);

  // !TODO: debug log, remove when done
  console.log({ publish: to, d });

  wsPublish(to, d);
}

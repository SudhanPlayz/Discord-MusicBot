import { ESocketEventType } from '../../interfaces/wsShared';
import { getPlayerQueue, wsPublish } from '../../utils/ws';

// this is hilarious
import { IHandleQueueUpdateParams } from '../../../../../lib/MusicEvents.d';
import { createEventPayload } from '../../utils/wsShared';

export default function handleQueueUpdate({
  guildId,
  player,
}: IHandleQueueUpdateParams) {
  if (!guildId?.length) throw new TypeError('Missing guildId');
  if (!player?.queue) throw new TypeError('Missing player queue');

  const to = 'player/' + guildId;
  const d = createEventPayload(
    ESocketEventType.GET_QUEUE,
    getPlayerQueue(player, true),
  );

  // !TODO: debug log, remove when done
  // console.log({ publish: to, d });

  wsPublish(to, d);
}

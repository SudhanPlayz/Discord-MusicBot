import { ESocketEventType } from '../../interfaces/wsShared';
import { createEventPayload, wsPublish } from '../../utils/ws';

// this is hilarious
import { IHandleTrackStartParams } from '../../../../../lib/MusicEvents.d';

export default function handleTrackStart({
  player,
  track,
}: IHandleTrackStartParams) {
  if (!player?.guild?.length) throw new TypeError('Missing guildId');

  wsPublish(
    'player/' + player.guild,
    createEventPayload(ESocketEventType.PLAYING, { ...track }),
  );
}

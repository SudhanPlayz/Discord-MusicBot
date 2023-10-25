/*
API should roll its own player utils, importing from main utils is BAD and causes circular import
as api should only be imported by Bot, not the other way around
*/
import { CosmicordPlayerExtended } from '../../../../lib/clients/MusicClient';
import { handleQueueUpdate, handleStop } from '../ws/eventsHandler';

export function spliceQueue(
  player: CosmicordPlayerExtended,
  ...restArgs: Parameters<typeof player.queue.splice>
) {
  const ret = player.queue.splice(...restArgs);

  handleQueueUpdate({ guildId: player.guild, player });

  return ret;
}

export async function playPrevious(player: CosmicordPlayerExtended) {
  const previousSong = player.queue.previous;
  const currentSong = player.queue.current;
  const nextSong = player.queue[0];

  if (
    !previousSong ||
    previousSong === currentSong ||
    previousSong === nextSong
  ) {
    return 1;
  }

  if (
    currentSong &&
    previousSong !== currentSong &&
    previousSong !== nextSong
  ) {
    spliceQueue(player, 0, 0, currentSong);

    // whatever the hell is this
    // @ts-ignore
    await player.play(previousSong);
  }
}

export function skip(player: CosmicordPlayerExtended) {
  const autoQueue = player.get('autoQueue');
  if (player.queue[0] == undefined && (!autoQueue || autoQueue === false)) {
    return 1;
  }

  player.queue.previous = player.queue.current;
  player.stop();

  handleStop({ guildId: (player as CosmicordPlayerExtended).guild });
}

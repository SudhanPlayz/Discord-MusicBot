import { LogSeverety } from '../interfaces/log';

export function wsLog(sev: LogSeverety, ...args: any[]) {
  console[sev]('wsServer:', ...args);
}

import { ItsOnClientConfig } from "./types";
import { ItsOnClient } from "./client";

declare global {
  interface Window {
    setFlag: (flag: any, value: boolean) => void
    disableFlag: (flag: any) => void
    getFlag: (flag: any) => void
    getAllFlags: () => void
    getDebugFlags: () => void
  }
}

const LOG_PREFIX = '[Its On]'
export class ItsOnBrowserClient<T extends string = string> extends ItsOnClient<T> {
  constructor(config: ItsOnClientConfig) {
    super(config)

    window.setFlag = (flag: T, value = true) => {
      this.setDebugFlag(flag, value)
    }
    window.disableFlag = (flag: T) => {
      this.setDebugFlag(flag, false)
    }
    window.getFlag = (flag: T) => {
      // eslint-disable-next-line no-console
      console.log(LOG_PREFIX, `${flag}: ${this.getFlagValue(flag)}`)
    }
    window.getAllFlags = () => {
      // eslint-disable-next-line no-console
      console.log(LOG_PREFIX, `Flags: ${JSON.stringify({ ...this.serverFlags, ...this.debugFlags }, null, '\t')}`)
    }
    window.getDebugFlags = () => {
      // eslint-disable-next-line no-console
      console.log(LOG_PREFIX, `Debug flags: ${JSON.stringify(this.serverFlags, null, '\t')}`)
    }
  }
}
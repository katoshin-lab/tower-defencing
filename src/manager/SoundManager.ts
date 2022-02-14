import { BrowserInfo, BotInfo, NodeInfo, detect, SearchBotDeviceInfo, ReactNativeInfo } from "detect-browser";

export default class SoundManager {
  public static instance: SoundManager;

  public static get sharedContext(): AudioContext | null {
    return SoundManager.context;
  }

  private static context: AudioContext | null = null;

  constructor() {
    if (SoundManager.instance) {
      throw new Error('SoundManager can not be initialized twice');
    }
  }

  public static init(ctx?: AudioContext): void {
    if (SoundManager.instance) {
      return;
    }
    
    SoundManager.instance = new SoundManager();

    if (ctx) {
      SoundManager.context = ctx;
    } else {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      SoundManager.context = new AudioContextClass();
    }

    const browser = detect();
    if (!browser) {
      return;
    }

    SoundManager.setSoundInitializeEvent(browser);
  }

  public static setSoundInitializeEvent(browser: BrowserInfo | BotInfo | NodeInfo | SearchBotDeviceInfo | ReactNativeInfo): void {
    console.log(browser)
  }
}
import * as PIXI from 'pixi.js';
import { detect } from "detect-browser";
import { Browser } from '../types/browser';
export default class SoundManager {
  public static instance: SoundManager;

  public static get sharedContext(): AudioContext | null {
    return SoundManager.context;
  }

  private static context: AudioContext | null = null;
  private static webAudioInitialized: boolean = false;

  private static readonly supportedExtensions = ['mp3'];

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
    SoundManager.useWebAudio(browser);
  }

  public static setSoundInitializeEvent(browser: Browser): void {
    const eventName = (document.ontouchend === undefined) ? 'mousedown' : 'touchend';
    let soundInitializer: () => void;

    const majorVersion = browser.version ? browser.version.split('.')[0] : '0';

    if (browser.name === 'chrome' && Number.parseInt(majorVersion, 10) >= 66) {
      soundInitializer = () => {
        if (SoundManager.sharedContext) {
          SoundManager.sharedContext.resume();
        }
        document.body.removeEventListener(eventName, soundInitializer);
      }
    } else if (browser.name === 'safari') {
      soundInitializer = () => {
        if (SoundManager.sharedContext) {
          const silentSource = SoundManager.sharedContext.createBufferSource();
          silentSource.buffer = SoundManager.sharedContext.createBuffer(1, 1, 44100);
          silentSource.connect(SoundManager.sharedContext.destination);
          silentSource.start(0);
          silentSource.disconnect();
        }
        document.body.removeEventListener(eventName, soundInitializer);
      };

    } else {
      return;
    }

    document.body.addEventListener(eventName, soundInitializer)
  }

  public static useWebAudio(browser: Browser): void {
    if (SoundManager.webAudioInitialized) {
      return;
    }

    const supportedExtensions = SoundManager.supportedExtensions;

    for (let i = 0; i < supportedExtensions.length; i++) {
      const extension = supportedExtensions[i];
      const PixiResource = PIXI.LoaderResource;
      PixiResource.setExtensionXhrType(
        extension,
        PixiResource.XHR_RESPONSE_TYPE.BUFFER
      );
      PixiResource.setExtensionLoadType(
        extension,
        PixiResource.LOAD_TYPE.XHR
      );
    }

    const majorVersion = browser.version ? browser.version.split('.')[0] : '0';
    let methodName = 'decodeAudio';
    if (browser.name === 'chrome' && Number.parseInt(majorVersion, 10) === 64) {
      methodName = 'decodeAudioWithPrimomise';
    }

    SoundManager.webAudioInitialized = true;
  }
}
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
}
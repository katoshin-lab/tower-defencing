import * as PIXI from 'pixi.js';
import Transition from '../interfaces/Transition'

export default class Immediate implements Transition {
  private onTransitionFinished: () => void = () => { };
  private finished: boolean = false;
  
  // トランジション描画物を含むPIXI.Containterインスタンスを返す
  public getContainer(): PIXI.Container | null {
    return null
  }

  public begin(): void {
    this.finished = true;
    this.onTransitionFinished();
  }

  public isBegin(): boolean {
    return false;
  }

  public isFinished(): boolean {
    return this.finished;
  }

  public isActive(): boolean {
    return false;
  }

  public update(_dt: number): void {
    return;
  }

  public setCallback(callback: () => void): void {
    this.onTransitionFinished = callback;
  }
}
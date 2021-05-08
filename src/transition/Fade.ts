import * as PIXI from 'pixi.js';
import GameManager from '../example/GameManager';
import Transition from '../interfaces/Transition'

export default class Fade implements Transition {
  private alphaFrom!: number;
  private alphaTo!: number;
  private alphaProgress: number;

  private container = new PIXI.Container();
  private overlay = new PIXI.Graphics();

  private transitionBegan: boolean = false;
  private transitionFinished: boolean = false;
  private onTransitionFinished: () => void = () => { };

  constructor(alphaFrom: number, alphaTo: number, alphaProgress: number) {
    this.alphaFrom = alphaFrom;
    this.alphaTo = alphaTo;
    this.alphaProgress = alphaProgress;

    const width = GameManager.instance.game.view.width;
    const height = GameManager.instance.game.view.height;

    this.overlay.beginFill(0x000000);
    this.overlay.moveTo(0, 0);
    this.overlay.lineTo(width, 0);
    this.overlay.lineTo(width, height);
    this.overlay.lineTo(0, height);
    this.overlay.endFill();

    this.overlay.alpha = this.alphaFrom;
    this.container.addChild(this.overlay);
  }

  public getContainer(): PIXI.Container | null {
    return this.container;
  }

  public begin(): void {
    this.transitionBegan = true;
  }

  public isBegin(): boolean {
    return this.transitionBegan;
  }

  public isFinished(): boolean {
    return this.transitionFinished;
  }

  public isActive(): boolean {
    return this.isBegin() && !this.isFinished();
  }

  public update(_dt: number): void {
    if (!this.isBegin() || this.isFinished()) return;

    if ((this.alphaTo <= this.alphaFrom && this.overlay.alpha <= this.alphaTo) || (this.alphaTo >= this.alphaFrom && this.overlay.alpha >= this.alphaTo)) {
      this.onTransitionFinished();
      this.transitionFinished = true;
    } else {
      this.overlay.alpha += this.alphaProgress;
    }
  }

  public setCallback(callback: () => void): void {
    this.onTransitionFinished = callback;
  }
}
import * as PIXI from 'pixi.js';
import GameManager from "../manager/GameManager";
import Scene from "./Scene";
import Fade from '../transition/Fade';
import FirstScene from './FirstScene';

export default class SecondScene extends Scene {
  private text: PIXI.Text;
  private count: number = 0;
  constructor() {
    super ()
    const renderer = GameManager.instance.game.renderer;
    this.text = new PIXI.Text('', new PIXI.TextStyle({
      fontSize: 64,
      fill: 0xffffff
    }));
    this.text.interactive = true;
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(renderer.width * 0.5, renderer.height * 0.5);
    this.text.on('pointerdown', this.nextScene);
    this.addChild(this.text);
    this.transitionIn = new Fade(1.0, 0.0, -0.05);
    this.transitionOut = new Fade(0.0, 1.0, 0.05);
  }

  public update(dt: number): void {
    super.update(dt);
    this.text.text = `second scene \n${this.count++}`
  }

  public nextScene(): void {
    GameManager.loadScene(new FirstScene())
  }
}

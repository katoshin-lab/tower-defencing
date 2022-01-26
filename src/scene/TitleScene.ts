import * as PIXI from 'pixi.js';
import Scene from "./Scene";
import Fade from 'transition/Fade';
import GameManager from '../example/GameManager';
import LoaderAddParam from 'interfaces/LoaderAddParam';

export default class TitleScene extends Scene {
  private text!: PIXI.Text;

  constructor() {
    super();
    
    this.transitionIn = new Fade(1.0, 0.0, -0.02);
    this.transitionOut = new Fade(0.0, 1.0, 0.02);

    const renderer = GameManager.instance.game.renderer;
    const textStyle = {
      fontSize: 64,
      fill: 0xffffff
    }

    this.text = new PIXI.Text('TOUCH TO START', new PIXI.TextStyle(textStyle));
    this.text.anchor.set(0.5, 0.5);
    this.position.set(renderer.width * 0.5, renderer.height * 0.5);
    this.addChild(this.text);

    this.interactive = true;
    this.on('pointerup', () => this.showOrderScene);
  }

  protected createInitialResourceList(): (LoaderAddParam | string)[] {
    const assets = super.createInitialResourceList();
    // assets
    return assets;
  }

  protected onResourceLoaded(): void {
    super.onResourceLoaded();
  }

  public showOrderScene(): void {
    console.log("should go to order scene");
  }
}

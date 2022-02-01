import * as PIXI from 'pixi.js';
import Scene from "./Scene";
import Fade from '../transition/Fade';
import GameManager from '../manager/GameManager';
import LoaderAddParam from 'interfaces/LoaderAddParam';
import { Resource } from '../Resources';

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
    let assets = super.createInitialResourceList();
    const staticResource = Resource.static;
    assets = assets.concat(staticResource.BattleBgFores.slice(0, 3));
    assets = assets.concat(staticResource.BattleBgMiddles.slice(0, 3));
    assets = assets.concat(staticResource.BattleBgBacks.slice(0, 3));
    return assets;
  }

  protected onResourceLoaded(): void {
    super.onResourceLoaded();
    const resources = GameManager.instance.game.loader.resources;
    const bgOrder = [
      ...Resource.static.BattleBgBacks,
      ...Resource.static.BattleBgMiddles,
      ...Resource.static.BattleBgFores
    ]

    GameManager.instance.game.loader.add(bgOrder)
    .load(() => {
      for (let i = 0; i < bgOrder.length; i++) {
        console.log(resources, bgOrder[i])
        const sprite = new PIXI.Sprite(resources[bgOrder[i]].texture);
        sprite.position.set(sprite.width * i, 0);
        this.addChild(sprite);
      }
    })

    const renderer = GameManager.instance.game.renderer;

    this.text = new PIXI.Text('TOUCH TO START', new PIXI.TextStyle({
      fontSize: 64,
      fill: 0xffffff
    }))
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(renderer.width * 0.5, renderer.height * 0.5);
    this.addChild(this.text);

    this.interactive = true;
    this.on('pointerup', () => this.showOrderScene());
  }

  protected setup(name: string): PIXI.Sprite {
    return new PIXI.Sprite(GameManager.instance.game.loader.resources[name].texture);
  }

  public showOrderScene(): void {
    console.log("should go to order scene");
  }
}
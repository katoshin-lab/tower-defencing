import * as PIXI from 'pixi.js';
// types
import { PixiApplicationOptions } from '../types/pixi';
import Scene from './Scene'


export default class GameManager {
  public static instance: GameManager;

  public game!: PIXI.Application;

  constructor(app: PIXI.Application) {
    if (GameManager.instance) {
      throw new Error('GameManager can be instantize only once');
    }

    this.game = app;
  }

  public static start({ ...params }: PixiApplicationOptions): void {
    const game = new PIXI.Application({ width: params.glWidth, height: params.glHeight, ...params });
    GameManager.instance = new GameManager(game);

    document.body.appendChild(game.view);
    game.ticker.add((delta: number) => {
      if (this.instance.currentScene) {
        this.instance.currentScene.update(delta);
      }
    })
  }

  private sceneTransitionOutFinished: boolean = true;
  private currentScene?: Scene;

  // 可能であれば新しいシーンのトランジションを開始
  public static transitionInIfPossible(newScene: Scene): boolean {
    const instance = GameManager.instance;
    if (!instance.sceneTransitionOutFinished) {
      return false;
    }
    if (instance.currentScene) {
      instance.currentScene.destroy();
    }
    instance.currentScene = newScene;
    if (instance.game) {
      instance.game.stage.addChild(newScene);
    }
    newScene.beginTransitionIn((_: Scene) => { });
    return true;
  }

  // シーンをロード。新しいシーンと古いシーンのトランジションを同時に開始する
  public static loadScene(newScene: Scene): void {
    const instance = GameManager.instance;
    if (instance.currentScene) {
      instance.sceneTransitionOutFinished = false;
      instance.currentScene.beginTransitionOut((_: Scene) => {
        instance.sceneTransitionOutFinished = true;
        GameManager.transitionInIfPossible(newScene);
      });
    } else {
      instance.sceneTransitionOutFinished = true;
      GameManager.transitionInIfPossible(newScene);
    }
  }
}
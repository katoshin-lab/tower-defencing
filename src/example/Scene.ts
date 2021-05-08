import * as PIXI from 'pixi.js';
import Transition from '../interfaces/Transition';
import Immediate from '../transition/Immediate';
import UpdateObject from '../interfaces/UpdateObject';

export default abstract class Scene extends PIXI.Container {
  protected transitionIn: Transition = new Immediate();
  protected transitionOut: Transition = new Immediate();
  // メインループ
  public update(delta: number): void {
    // this.updateRegisteredObjects(delta);
    if (this.transitionIn.isActive()) {
      this.transitionIn.update(delta);
    } else if (this.transitionOut.isActive()) {
      this.transitionOut.update(delta);
    }
  }

  // メインループで更新を行うべきオブジェクトの登録
  protected registerUpdateObject(object: UpdateObject): void {
    console.log(object)
  }
  // 登録されたオブジェクトのフレーム更新
  protected updateRegisteredObjects(delta: number): void {
    console.log(delta)
  }
  // シーン開始トランジション
  // 引数はトランジション終了時のコールバック
  public beginTransitionIn(onTransitionFinished: (scene: Scene) => void): void {
    this.transitionIn.setCallback(() => onTransitionFinished(this));

    const container = this.transitionIn.getContainer();
    if (container) {
      this.addChild(container);
    }
    this.transitionIn.begin();
  }

  // シーン終了トランジション
  // 引数はトランジション終了時のコールバック
  public beginTransitionOut(onTransitionFinished: (scene: Scene) => void): void {
    this.transitionOut.setCallback(() => onTransitionFinished(this));

    const container = this.transitionOut.getContainer();
    if (container) {
      this.addChild(container);
    }
    this.transitionOut.begin();
  }
}
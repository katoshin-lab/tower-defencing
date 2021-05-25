import * as PIXI from 'pixi.js';
import Immediate from '../transition/Immediate';
// interfaces
import UpdateObject from '../interfaces/UpdateObject';
import Transition from '../interfaces/Transition';
import LoaderAddParam from '../interfaces/LoaderAddParam';

export default abstract class Scene extends PIXI.Container {
  protected transitionIn: Transition = new Immediate();
  protected transitionOut: Transition = new Immediate();
  protected objectsToUpdate: UpdateObject[] = [];
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
    this.objectsToUpdate.push(object);
  }

  // 登録されたオブジェクトのフレーム更新
  protected updateRegisteredObjects(delta: number): void {
    const nextObjectsToUpdate = [];

    for (let i = 0; i < this.objectsToUpdate.length; i++) {
      const obj = this.objectsToUpdate[i];
      if (!obj || obj.isDestroyed()) {
        continue;
      }
      obj.update(delta);
      nextObjectsToUpdate.push(obj);
    }

    this.objectsToUpdate = nextObjectsToUpdate;
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

  protected createInitialResourceList(): (LoaderAddParam | string)[] {
    return [];
  }
}
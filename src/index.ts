import GameManager from "./manager/GameManager";
import TitleScene from "./scene/TitleScene";
import './config';

window.onload = () => {
  GameManager.start({
    glWidth: 1136,
    glHeight: 640,
    backgroundColor: 0x222222
  })
  GameManager.loadScene(new TitleScene());
}
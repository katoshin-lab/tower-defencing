import FirstScene from "./example/FirstScene"
import GameManager from "./example/GameManager"

window.onload = () => {
  GameManager.start({
    glWidth: 1136,
    glHeight: 640,
    backgroundColor: 0x222222
  })
  GameManager.loadScene(new FirstScene());
}
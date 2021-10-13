import { atom } from "recoil";

const fullScreen = atom({
  key: 'fullScreen',
  default: false
})

const showHeader = atom({
  key: 'showHeader',
  default: true
})

const layoutStates = {
  fullScreen,
  showHeader
}

export default layoutStates

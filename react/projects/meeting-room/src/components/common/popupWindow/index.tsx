import * as React from 'react';
import { useRecoilState } from 'recoil';
import { popupSelector } from '../../../recoil/atoms/popup';
import NewWindow from 'react-new-window';

const PopupWindow = () => {

  const [popup, setPopup] = useRecoilState(popupSelector);

  if (!popup) return null;
  const { title, checkoutUrl } = popup;

  const popupUnloaded = () => {
    console.log('POP-UP UNLOADED');
    setPopup(null);
  }

  const popupBlocked = () => {
    console.log('POP-UP BLOCKED');
  }

  return (
    <NewWindow
      name={title}
      title={title}
      url={checkoutUrl}
      features={{ width: (window.innerWidth * 0.8), height: (window.innerHeight * 0.93) }}
      onUnload={popupUnloaded}
      onBlock={popupBlocked}
      center={'parent'}
      copyStyles={true}
    >
      <h1>Hi 👋</h1>
    </NewWindow>
  );
};
export default PopupWindow;
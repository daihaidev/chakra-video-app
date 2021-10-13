import * as React from 'react';
import './_styles.css';
import { heartAnimationSelector } from '../../../recoil/atoms/heartAnimation';
import { useRecoilValue } from 'recoil';

// https://codepen.io/lisafolkerson/pen/BjRoJO

const MOEmoji = () => {
  const heartAnimating = useRecoilValue(heartAnimationSelector);
  if (heartAnimating !== true) return null;

  return (
    <>
      <div className="heart x1"></div>
      <div className="heart x2"></div>
      <div className="heart x3"></div>
      <div className="heart x4"></div>
      <div className="heart x5"> </div>
      <div className="altheart x6"></div>
    </>
  );
};
export default MOEmoji;

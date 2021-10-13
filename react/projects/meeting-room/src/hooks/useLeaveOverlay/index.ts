import React, { useRef } from "react";

const useLeaveOverlay = (showLeave: boolean, defaultStatus: boolean) => {

  const [showLeaveOverlay, setShowLeaveOverlay] = React.useState(showLeave && defaultStatus)
  const [hidingLeaveOverlay, setHidingLeaveOverlay] = React.useState(false)

  React.useEffect(() => {
    if (showLeave && showLeaveOverlay && !hidingLeaveOverlay) {
      setHidingLeaveOverlay(true)
      setTimeout(() => {
        setShowLeaveOverlay(false)
        setHidingLeaveOverlay(false)
      }, 5000)
    }
  }, [showLeaveOverlay, showLeave, hidingLeaveOverlay])

  return { showLeaveOverlay, setShowLeaveOverlay }
};

export default useLeaveOverlay;
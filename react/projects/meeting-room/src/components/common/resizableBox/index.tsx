import styled from "@emotion/styled"
import { ResizableBox } from "react-resizable"

export const StyledResizableBox = styled(ResizableBox)`
  position: relative;

  .custom-handle {
    position: absolute;
    background-color: #b1bdcd;
    opacity: 0.95;
    z-index: 1200;
    transition: all 0.1s ease;

    &:hover {
      background-color: #dd3c66;
      opacity: 1;
      z-index: 1200;
    }
  }

  .custom-handle-sw {
    bottom: -4px;
    left: -4px;
    cursor: sw-resize;
  }
  .custom-handle-se {
    bottom: -4px;
    right: -4px;
    cursor: se-resize;
  }
  .custom-handle-nw {
    top: -4px;
    left: -4px;
    cursor: nw-resize;
  }
  .custom-handle-ne {
    top: -4px;
    right: -4px;
    cursor: ne-resize;
  }
  .custom-handle-w,
  .custom-handle-e {
    top: 0;
    width: 8px;
    height: 100vh;
    cursor: ew-resize;
  }
  .custom-handle-w {
    left: -4px;
  }
  .custom-handle-e {
    right: -4px;
  }
  .custom-handle-n,
  .custom-handle-s {
    left: 50%;
    cursor: ns-resize;
  }
  .custom-handle-n {
    top: -4px;
  }
  .custom-handle-s {
    height: 8px;
    width: 100vw;
    bottom: 0;
    width: 100vw;
    left: 0;
    right: 0;
  }
`

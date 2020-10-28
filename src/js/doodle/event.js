import {
  EVENT_POINTER_DOWN,
  EVENT_POINTER_MOVE,
  EVENT_POINTER_UP
} from './constants';
import {
  addListener,
  removeListener,
} from '../utilities';
export default {
  bind() {
    const {
      element,
      doodleCanvas
    } = this;
    
    addListener(doodleCanvas, EVENT_POINTER_DOWN, (this.onDoodleStart = this.doodleStart.bind(this)));
    addListener(doodleCanvas, EVENT_POINTER_MOVE, (this.onDoodleMove = this.doodleMove.bind(this)));
    addListener(doodleCanvas, EVENT_POINTER_UP, (this.onDoodleEnd = this.doodleEnd.bind(this)));
  },
  unbind() {
    const {
      element,
      doodleCanvas
    } = this;
    removeListener(doodleCanvas, EVENT_POINTER_DOWN, this.onDoodleStart);
    removeListener(doodleCanvas, EVENT_POINTER_MOVE, this.onDoodleMove);
    removeListener(doodleCanvas, EVENT_POINTER_UP, this.onDoodleEnd);
  }
}
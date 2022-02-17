import {
  EVENT_POINTER_DOWN,
  EVENT_POINTER_MOVE,
  EVENT_POINTER_UP,
  EVENT_TOUCH_START,
  EVENT_TOUCH_MOVE,
  EVENT_TOUCH_END
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
    addListener(doodleCanvas, EVENT_TOUCH_START, (this.onDoodleStart = this.doodleStart.bind(this)));
    addListener(doodleCanvas, EVENT_TOUCH_MOVE, (this.onDoodleMove = this.doodleMove.bind(this)));
    addListener(doodleCanvas, EVENT_TOUCH_END, (this.onDoodleEnd = this.doodleEnd.bind(this)));
  },
  unbind() {
    const {
      element,
      doodleCanvas
    } = this;
    removeListener(doodleCanvas, EVENT_TOUCH_START, this.onDoodleStart);
    removeListener(doodleCanvas, EVENT_TOUCH_MOVE, this.onDoodleMove);
    removeListener(doodleCanvas, EVENT_TOUCH_END, this.onDoodleEnd);
  }
}
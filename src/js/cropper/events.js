import {
  EVENT_POINTER_DOWN,
  EVENT_POINTER_MOVE,
  EVENT_POINTER_UP
} from './constants';
import {
  addListener,
  isFunction,
  removeListener,
} from '../utilities';
export default {
    bind(){
        const {element} = this;
        addListener(element.ownerDocument, EVENT_POINTER_DOWN, (this.onCropStart = this.cropStart.bind(this)));
        addListener(element.ownerDocument, EVENT_POINTER_MOVE, (this.onCropMove = this.cropMove.bind(this)));
        addListener(element.ownerDocument, EVENT_POINTER_UP, (this.onCropEnd = this.cropEnd.bind(this)));
    },
    unbind(){
      const {
        element
      } = this;
        removeListener(element.ownerDocument, EVENT_POINTER_DOWN, this.onCropStart);
        removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove);
        removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd);
    }
}
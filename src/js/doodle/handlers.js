import {
  getPointer,
  getData,
  forEach,
  assign
} from "../utilities";

export default {
  doodleStart(event) {
    const {
      pointers,
      doublePointers,
      options
    } = this;

    if (event.targetTouches.length === 1 && options.tool !== 'zoom') {
      // Handle touch event
      pointers[0] = getPointer(event.targetTouches[0]);
      event.preventDefault();
      event.stopPropagation();
    } else if(event.targetTouches.length === 2){
      let i = 0;
      forEach(event.targetTouches, (touch) => {
        doublePointers[i] = getPointer(touch);
        i++
      });
      event.preventDefault();
      event.stopPropagation();
    }
    this.action = true;
  },
  doodleMove(event) {
    const {
      pointers,
      action,
      doublePointers,
      options
    } = this;

    if (!action) {
      return;
    }

    if (event.targetTouches.length === 1 && options.tool !== 'zoom') {
      assign(pointers[0] || {}, getPointer(event.targetTouches[0], true));
      this.change(event);
      event.preventDefault();
      event.stopPropagation();
    } else if (event.targetTouches.length === 2) {
      let i = 0;
      forEach(event.targetTouches, (touch) => {
        // The first parameter should not be undefined (#432)
        assign(doublePointers[i] || {}, getPointer(touch, true));
        i++
      });
      this.doubleFinger(event)
      event.preventDefault();
      event.stopPropagation();
    }

    
  },
  doodleEnd(event) {
    const {
      pointers,
      action
    } = this;

    this.doubleFingerRange = 0
    if (event.targetTouches) {
      let i = 0;
      forEach(event.targetTouches, (touch) => {
        delete pointers[i];
        delete doublePointers[i];
        i++
      });
    } else {
      delete pointers[0];
    }

     if (!action) {
       return;
     }

     if (!Object.keys(pointers).length) {
       this.action = false;
     }

    event.preventDefault();
    event.stopPropagation();
  }
}
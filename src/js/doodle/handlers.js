import {
  getPointer,
  getData,
  forEach,
  assign
} from "../utilities";

export default {
  doodleStart(event) {
    const {
      pointers
    } = this;

    if (event.changedTouches) {
      // Handle touch event
      forEach(event.changedTouches, (touch) => {
        pointers[0] = getPointer(touch);
      });
    } else {
      // Handle mouse event and pointer event
      pointers[0] = getPointer(event);
    }

    this.action = true;

    event.preventDefault();
    event.stopPropagation();
  },
  doodleMove(event) {
  
    const {
      pointers,
      action
    } = this;

    if (!action) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.changedTouches) {
      forEach(event.changedTouches, (touch) => {
        // The first parameter should not be undefined (#432)
        assign(pointers[0] || {}, getPointer(touch, true));
      });
    } else {
      assign(pointers[0] || {}, getPointer(event, true));
    }
    
    this.change(event);
  },
  doodleEnd(event) {
    const {
      pointers,
      action
    } = this;

    if (event.changedTouches) {
      forEach(event.changedTouches, (touch) => {
        delete pointers[0];
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
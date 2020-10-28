import {
    REGEXP_ACTIONS,
    DATA_ACTION
} from "./constants"

import {
    getPointer,
    getData,
    forEach,
    assign
} from "../utilities"

export default {
    cropStart(event){
        const {
          pointers
        } = this;
        let action;

        if (event.changedTouches) {
          // Handle touch event
          forEach(event.changedTouches, (touch) => {
            pointers[0] = getPointer(touch);
          });
        } else {
          // Handle mouse event and pointer event
          pointers[0] = getPointer(event);
        }

        action = getData(event.target, DATA_ACTION);

        if (!REGEXP_ACTIONS.test(action)) {
          return;
        }
        
        event.preventDefault();
        event.stopPropagation();

        this.action = action;
    },
    cropMove(event) {
      this.startEventTimer = Date.now()
      
        const {
          action
        } = this;

        if (!action) {
          return;
        }
        
        const {
          pointers
        } = this;

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
    cropEnd(event){
        const {
          action,
          pointers
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
          this.action = '';
        }

        event.preventDefault();
        event.stopPropagation();
    }
}
import {
  ACTION_NORTH_EAST,
  ACTION_NORTH_WEST,
  ACTION_SOUTH_EAST,
  ACTION_SOUTH_WEST,
  ACTION_ALL,
} from "./constants"

import {
    forEach
} from "../utilities"

export default {
    change(event){
        const {
          cropBoxData,
          pointers,
        } = this;

        let {
          action
        } = this;
        
        let {
          left,
          top,
          width,
          height,
          minLeft,
          minTop,
          maxLeft,
          maxTop
        } = cropBoxData;
        
        let renderable = true;
        const pointer = pointers[Object.keys(pointers)[0]];
        const range = {
          x: pointer.endX - pointer.startX,
          y: pointer.endY - pointer.startY,
        };
        switch (action) {
          //右上角
          case ACTION_NORTH_EAST:
            top += range.y;
            width += range.x;
            if (left + width > maxLeft) {
                renderable = false;
                // break;
            }
            
            if (range.y < 0 && top <= minTop) {
              renderable = false;
            //   break;
            }
            height -= range.y;
            break;
            //左上角
          case ACTION_NORTH_WEST:
            left += range.x;
            top += range.y;

            if(range.x < 0 && left <= minLeft){
                renderable = false;
                // break;
            }
            if (range.y < 0 && top <= minTop) {
              renderable = false;
            //   break;
            }
            width -= range.x;
            height -= range.y;
            break;
            //右下角
          case ACTION_SOUTH_EAST:
            width += range.x;
            if (left + width > maxLeft) {
              renderable = false;
            //   break;
            }
            height += range.y;
            if (top + height > maxTop) {
              renderable = false;
            //   break;
            }
            break;
            //左下角
          case ACTION_SOUTH_WEST:
            left += range.x;
            if (range.x < 0 && left <= minLeft) {
              renderable = false;
            //   break;
            }
            width -= range.x;
            height += range.y;
            if (top + height > maxTop) {
              renderable = false;
            //   break;
            }
            break;
        case ACTION_ALL:
            left += range.x;
            if(left + width > maxLeft){
                renderable = false;
            }
            top += range.y
            if(top + height > maxTop){
                renderable = false;
            }
            break;
          default:
            break;
        }

        if (renderable) {
            cropBoxData.width = width;
            cropBoxData.height = height;
            cropBoxData.left = left;
            cropBoxData.top = top;
            this.renderCropBox();
        }

        // 覆盖开始坐标
        forEach(pointers, (p) => {
          p.startX = p.endX;
          p.startY = p.endY;
        });
    }
}
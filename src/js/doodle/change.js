import {
  forEach
} from "../utilities"
export default {
  change(event) {
    const {
      pointers,
      doodleContext,
      canvasData,
      containerData,
      options,
      doodleWrapBox
    } = this;
    if(options.tool === "zoom"){
      return
    }
    const pointer = pointers[Object.keys(pointers)[0]];

    let {
        startX,
        startY,
        endX,
        endY
    } = pointer;
    startX -= canvasData.left - doodleWrapBox.scrollLeft + containerData.x;
    startY -= canvasData.top - doodleWrapBox.scrollTop + containerData.y;
    endX -= canvasData.left - doodleWrapBox.scrollLeft + containerData.x;
    endY -= canvasData.top - doodleWrapBox.scrollTop + containerData.y;

    startX = startX/this.scale
    startY = startY/this.scale
    endX = endX/this.scale
    endY = endY/this.scale

    doodleContext.beginPath()
    doodleContext.moveTo(startX, startY);
    doodleContext.lineTo(endX, endY);

    doodleContext.closePath();
    doodleContext.stroke();

    //保存画笔每一帧的数据
    this.doodleData.push({
      pointer:{
        startX: startX/this.scale,
        startY: startY/this.scale,
        endX: endX/this.scale,
        endY: endY/this.scale
      },
      tool: options.tool,
      toolColor: options.toolColor,
      pencilSize: options.pencilSize
    });
    // 覆盖开始坐标
    forEach(pointers, (p) => {
      if(!p){
        return;
      }
      p.startX = p.endX;
      p.startY = p.endY;
    });
  },
  doubleFinger(){
    const {
      doublePointers,
      doubleFingerRange
    } = this;
    const event1 = doublePointers[0];
    const event2 = doublePointers[1];
    let range = Math.abs(event2.endY - event1.endY);
    if(doubleFingerRange < range){
      this.enlarge()
    } else {
      this.reduce()
    }

    this.doubleFingerRange = range;
  }
}
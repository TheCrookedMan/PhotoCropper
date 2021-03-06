import {
  forEach
} from "../utilities"
export default {
  change(event) {
    const {
      pointers,
      doodleContext,
      canvasData,
      options
    } = this;

    const pointer = pointers[Object.keys(pointers)[0]];
    
    let {
        startX,
        startY,
        endX,
        endY
    } = pointer;

    startX -= canvasData.left;
    startY -= canvasData.top;
    endX -= canvasData.left;
    endY -= canvasData.top;

    doodleContext.beginPath()
    doodleContext.moveTo(startX, startY);
    doodleContext.lineTo(endX, endY);

    doodleContext.closePath();
    doodleContext.stroke();

    //保存画笔每一帧的数据
    this.doodleData.push({
      pointer:{
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY
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
  }
}
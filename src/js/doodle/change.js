import {
  forEach,
  setStyle,
  assign,
  getTransforms
} from "../utilities"
export default {
  change(event) {
    const {
      pointers,
      doodleContext,
      canvasData,
      containerData,
      options,
      canvas
    } = this;
    const pointer = pointers[Object.keys(pointers)[0]];
    let {
      startX,
      startY,
      endX,
      endY
    } = pointer;
    if(options.tool === "zoom"){
      let maxX = canvasData.width - containerData.width,
      maxY = canvasData.height - containerData.height,
      moveX = endX - startX,
      moveY = endY - startY;

      let _translateX = 0,_translateY = 0;
      if(maxX > 0){
        //往左拖动
        if(moveX < 0){
          _translateX = canvasData.left + moveX < -maxX ? -maxX : canvasData.left + moveX
        } else {
          //往右
          _translateX = canvasData.left + moveX > 0 ? 0 : canvasData.left + moveX
        }
      } else {
        _translateX = canvasData.left
      }
      if(maxY > 0){
        //往上拖动
        if(moveY < 0){
          _translateY = canvasData.top + moveY < -maxY ? -maxY : canvasData.top + moveY
        } else {
          //往下
          _translateY = canvasData.top + moveY > 0 ? 0 : canvasData.top + moveY
        }
      } else {
        _translateY = canvasData.top
      }

      setStyle(canvas, assign({
        width: canvasData.width,
        height: canvasData.height
      }, getTransforms({
        translateX: _translateX,
        translateY: _translateY
      })));
      return
    }

    startX -= canvasData.left + containerData.x;
    startY -= canvasData.top + containerData.y;
    endX -= canvasData.left + containerData.x;
    endY -= canvasData.top + containerData.y;

     //保存画笔每一帧的数据
     this.doodleData.push({
      pointer:{
        startX,
        startY,
        endX,
        endY,
        scale: this.scale
      },
      tool: options.tool,
      toolColor: options.toolColor,
      pencilSize: this.doodleContext.lineWidth
    });

    startX = startX/this.scale
    startY = startY/this.scale
    endX = endX/this.scale
    endY = endY/this.scale

    doodleContext.beginPath()
    doodleContext.moveTo(startX, startY);
    doodleContext.lineTo(endX, endY);

    doodleContext.closePath();
    doodleContext.stroke();

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
import {
  MIME_TYPE_JPEG,
  IMAGE_DEFINITION
} from './constants'

export default {
  // 初始化图片宽高比
  initialAspectRatio: NaN,
  // 默认图片宽高比
  aspectRatio: NaN,
  //输出文件类型
  outPutImageType: MIME_TYPE_JPEG,
  //输出图片文件清晰度
  outPutImageDefinition: IMAGE_DEFINITION,
  //工具、pencil、rubber、zoom
  tool: 'pencil',
  //工具颜色
  toolColor: '#000',
  //画笔大小 S/M/L/XL/XXL
  pencilSize: 'L',
  //最大放大倍数
  maxScale: 2,
  //最小放大倍数
  minScale: 1,
  //默认图片显示倍数
  scale:1,
  //每次放大或者缩小的递进倍数
  stepScaleNumber: 0.02
};
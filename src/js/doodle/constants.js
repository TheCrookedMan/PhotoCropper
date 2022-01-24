export const IS_BROWSER = typeof window !== 'undefined';
export const WINDOW = IS_BROWSER ? window : {};
export const IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false;
export const HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;

export const REGEXP_TAG_NAME = /^img|canvas$/i;
export const REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
//输出图片类型
export const MIME_TYPE_JPEG = 'image/jpeg';
//输出图片文件清晰度
export const IMAGE_DEFINITION = 1.0;

export const NAMESPACE = 'doodle';

export const CLASS_HIDE = `${NAMESPACE}-hide`;
export const CLASS_HIDDEN = `${NAMESPACE}-hidden`;
//Event
export const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
export const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
export const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
export const EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
export const EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
export const EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;

//canvas 图片留边的边框宽度
export const BORDER_WIDTH = 5;
export let clientWidth = (document.body.clientWidth || window.screen.availWidth) - 2*BORDER_WIDTH;
export let S = Math.ceil(clientWidth * 0.01);
export let M = Math.ceil(clientWidth * 0.03);
export let L = Math.ceil(clientWidth * 0.04);
export let XL = Math.ceil(clientWidth * 0.05);
export let XXL = Math.ceil(clientWidth * 0.06);
export let LG = Math.ceil(clientWidth * 0.1);

export const IS_BROWSER = typeof window !== 'undefined';
export const WINDOW = IS_BROWSER ? window : {};
export const NAMESPACE = 'cropper';
export const IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false;
export const HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;

//正则表达式
export const REGEXP_ACTIONS = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/;
export const REGEXP_TAG_NAME = /^img|canvas$/i;
export const REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
//输出图片类型
export const MIME_TYPE_JPEG = 'image/jpeg';
//输出图片文件清晰度
export const IMAGE_DEFINITION = 1.0;
//裁切框模式
export const CROP_MODEL = 'freedom'

//Classes
export const CLASS_CROP = `${NAMESPACE}-crop`;
export const CLASS_DISABLED = `${NAMESPACE}-disabled`;
export const CLASS_HIDDEN = `${NAMESPACE}-hidden`;
export const CLASS_HIDE = `${NAMESPACE}-hide`;
export const CLASS_INVISIBLE = `${NAMESPACE}-invisible`;
export const CLASS_MODAL = `${NAMESPACE}-modal`;
export const CLASS_MOVE = `${NAMESPACE}-move`;

// Data keys
export const DATA_ACTION = `${NAMESPACE}Action`;
export const DATA_PREVIEW = `${NAMESPACE}Preview`;

//Event
export const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
export const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
export const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
export const EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
export const EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
export const EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;

//Actions
//右上角
export const ACTION_NORTH_EAST = 'ne';
//左上角
export const ACTION_NORTH_WEST = 'nw';
//右下角
export const ACTION_SOUTH_EAST = 'se';
//左下角
export const ACTION_SOUTH_WEST = 'sw';
//裁剪框整体移动
export const ACTION_MOVE = 'move';
export const ACTION_ALL = 'all';

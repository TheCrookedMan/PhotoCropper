export const IS_BROWSER = typeof window !== 'undefined';
export const WINDOW = IS_BROWSER ? window : {};
export const REGEXP_TAG_NAME = /^img|canvas$/i;
export const REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
//输出图片类型
export const MIME_TYPE_JPEG = 'image/jpeg';
//输出图片文件清晰度
export const IMAGE_DEFINITION = 1.0;

export const NAMESPACE = 'discoloration';

export const CLASS_HIDE = `${NAMESPACE}-hide`;
export const CLASS_HIDDEN = `${NAMESPACE}-hidden`;
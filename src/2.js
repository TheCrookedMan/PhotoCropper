import {
  Cropper
} from '../dist/main.bundle.js'
// import {
//   Cropper
// } from './main.js'

new Cropper(document.getElementById('panel'), {
  checkCrossOrigin: true,
  cropMinH: 20,
  initCropBoxWidth: 200
})
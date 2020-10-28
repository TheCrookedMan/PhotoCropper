import __1 from './assets/1.png';
import __2 from './assets/2.jpeg';
import __3 from './assets/3.jpeg';
import __4 from './assets/WechatIMG65.jpeg'
import __test1 from './assets/test1.jpeg'
import __test2 from './assets/test2.jpeg'
import __test3 from './assets/test3.jpeg'
import __test4 from './assets/test4.jpeg'
import __test5 from './assets/test5.jpeg'
import __test6 from './assets/test6.jpeg'


import Cropper from './js/cropper/cropper';
import './index.less'
import Doodle from './js/doodle/doodle';
import DisColoration from './js/discoloration/discoloration';

let img = document.createElement('img')

// img.src = 'http://peidian-sit.oss-cn-shanghai.aliyuncs.com/PROBLEM/20190725/oQ6FP1urwDjUq8DfMqNSzsixOcP8/1564020476671-modify.JPG';
img.src = __test2
img.id = 'image'

document.getElementById("body").appendChild(img)


// var disc = new DisColoration(document.getElementById('image'),{
//   checkCrossOrigin:true
// })

var cropper = new Cropper(document.getElementById('image'),{
    checkCrossOrigin:true,
    cropMinH: 20,
    initCropBoxWidth: 200,
})
// document.getElementById('reverseX').onclick = function () {
//     cropper.scaleX();
// }

// document.getElementById('reverseY').onclick = function () {
//   cropper.scaleY();
// }

// document.getElementById('rotate').onclick = function () {
//   cropper.rotate(90);
// }

// document.getElementById('canvasData').onclick = function(){
//   // console.log(cropper.getCroppedCanvas())
//   // document.body.innerHTML = ''
//   // document.body.append(cropper.getCroppedCanvas())
//   var _src = cropper.toDataURL();
//   build(_src)

//   // cropper.toBlob(function(result){
//   //   console.log(result)
//   // })
//   // cropper.destroy();
//   // cropper = new Cropper(document.getElementById('image'), {})
// }


// function build(_src){
//   cropper.destroy();
//   document.getElementById('image').src = _src;
//   cropper = new Cropper(document.getElementById('image'), {
//     // checkCrossOrigin:true
//   })
// }

// let doodle = new Doodle(document.getElementById('image'), {
//     outPutImageDefinition: 0.5
// });
// document.getElementById('getDoodleCanvas').onclick = function () {

//   console.log(doodle.toDataURL());
//   // let img = document.createElement('img');
//   // img.src = doodle.toDataURL();
//   // document.getElementById("body").append(img);
//   // doodle.destroy();
// }

// document.getElementById('rubber').onclick = function () {

//   doodle.rubber()
//   // let img = document.createElement('img');
//   // img.src = doodle.toDataURL();
//   // document.getElementById("body").append(img);
//   // doodle.destroy();
// }

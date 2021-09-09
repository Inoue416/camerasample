let width = 720
let height = 960

let streaming = false

let video = null
let canvas = null
let photo = null
let startbutton = null
let constrains = { video: {
    width: 360,
    height: 480,
    frameRate: 30,
    facingMode: 'environment',
  },
  audio: true
}
let recorder = null
let record_data = null

function sound(element){
  element.play();
}
/**
* ユーザーのデバイスによるカメラ表示を開始し、
* 各ボタンの挙動を設定する
*
*/
function startup() {
video = document.getElementById('video')
canvas = document.getElementById('canvas')
startbutton = document.getElementById('startbutton')
stopbutton  = document.getElementById('stopbutton')
downloadbutton = document.getElementById('download')
sound_on = document.getElementById('sound-on')
sound_off = document.getElementById('sound-off')

videoStart()

video.addEventListener('canplay', function(ev){
if (!streaming) {
  video.setAttribute('width', width)
  video.setAttribute('height', height)
  streaming = true
}
}, false)

startRecorder()

// 「start」ボタンをとる挙動を定義
startbutton.addEventListener('click', function(ev){
sound(sound_on);
recorder.start()
ev.preventDefault()
}, false);

stopbutton.addEventListener('click', function(ev) {
recorder.stop()
sound(sound_off);
})

downloadbutton.addEventListener('click', function(ev) {
console.log(record_data)
var blob = new Blob([record_data], { type: 'video/mp4' })
var url = window.URL.createObjectURL(blob)
var a = document.createElement('a')
document.body.appendChild(a)
a.style = 'display:none'
a.href = url;
a.download = 'test.mp4'
a.click()
window.URL.revokeObjectURL(url)
})
}

/**
* カメラ操作を開始する
*/
function videoStart() {
streaming = false
console.log(streaming)
navigator.mediaDevices.getUserMedia(constrains)
.then(function(stream) {
  video.srcObject = stream
  video.play()
})
.catch(function(err) {
  console.log("An error occured! " + err)
})
}

function startRecorder() {
navigator.mediaDevices.getUserMedia(constrains)
.then(function (stream) {
recorder = new MediaRecorder(stream, {mineType: 'video/mp4'})
recorder.ondataavailable = function (e) {
  var confirm = document.getElementById('confirm')
  confirm.setAttribute('controls', '')
  confirm.setAttribute('width', width)
  confirm.setAttribute('height', height)
  var outputdata = window.URL.createObjectURL(e.data)
  record_data=e.data
  confirm.src = outputdata
}
})
}

startup();
<button :class="{ noActive: true, cameraOn: cameraOnOff[0] }" @click="stopButton" id="recode-button" class="button-animation"></button>

let sound_on = null
let sound_off = null
let width = 720
let height = 960
let streaming = false
let video = null
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

function stopBothVideoAndAudio(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });
}
/**
* ユーザーのデバイスによるカメラ表示を開始し、
* 各ボタンの挙動を設定する
*
*/
function startup() {
video = document.getElementById('video')
//downloadbutton = document.getElementById('download')
videoStart()

video.addEventListener('canplay', function(ev){
if (!streaming) {
  streaming = true
}
}, false)

startRecorder()

/*downloadbutton.addEventListener('click', function(ev) {
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
})*/
}

/**
* カメラ操作を開始する
*/
function videoStart() {
streaming = false
console.log(streaming)
console.log('Start camera.')
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
  var outputdata = window.URL.createObjectURL(e.data)
  record_data=e.data
  confirm.src = outputdata
}
console.log('Start recoder.')
})
}
/* Vue App */
let data = null
const app = Vue.createApp({})
app.component('video-display',{
  //inject: ['headFoot'],
  data(){
    return{
      judge: 0,
      buttonActive: [false, true],
      confirmVideo: true,
      cameraOnOff: [false, false],
      state: 0,
      message: null
    }
  },
  mounted(){
    console.log('Complet setup.')
    sound_on = document.getElementById('sound_on')
    sound_off = document.getElementById('sound_off')
    data = document.getElementById("data")
    this.message = data.innerHTML
    data.remove()
    startup();
  },
  methods:{
    stateButton(ev){
      if (ev === 0){
        sound(sound_on);
        recorder.start()
        this.cameraOnOff[0] = true
        this.state = 1
      }
      else if (ev === 1){
        recorder.stop();
        sound(sound_off);
        video.srcObject = null
        this.buttonActive[0] = true
        this.buttonActive[1] = false
        this.confirmVideo = false
        this.cameraOnOff[0]=false
        this.cameraOnOff[1] = true
        this.state = 0
      }
    },
    /*decisionButton(){

    },*/
    reRecodeButton(){
      this.buttonActive[1] = true
      this.buttonActive[0] = false
      this.confirmVideo = true
      this.cameraOnOff[1] = false
      startup();
    }
  },
  template: `
    <div :class="{ noActive: buttonActive[1] }">
      <header style="margin-bottom: 70px;">
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <h3><a class="navbar-brand" href="#">Upload App</a></h3>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
            </ul>
          </div>
        </nav>
      </header>
    </div>

    <div class="container">

      <div :class="{ noActive: !confirmVideo }">
        <div class="cont" >
          <div class="cont-inner">{{ message }}</div>
        </div>
      </div>
      <br>

      <video :class="{ noActive: confirmVideo }" id="confirm">Error.</video>
      <video id="video" :class="{ noActive: !confirmVideo }">Video stream not available.</video>
      <br />

      <div class="camera-button-area" :class="{ noActive: !confirmVideo }">
        <div class="button-circle">
          <button :class="{ noActive: buttonActive[0], cameraOn: cameraOnOff[0], cameraOff: cameraOnOff[1] }"
          v-on:click="stateButton(this.state)" id="recode-button" class="button-animation"></button>
        </div>
      </div>

      <div class="row" :class="{ noActive: buttonActive[1] }">
        <button id="recode-button"
        class="btn btn-primary" @click="decisionButton">アップロード</button>
        <button @click="reRecodeButton" id="recode-button"
        class="btn btn-outline-secondary">撮り直す</button>
      </div>

      <audio id="sound_on" preload="auto" src="/static/sound/video_on.mp3">
      </audio>
      <audio id="sound_off" preload="auto" src="/static/sound/video_off.mp3">
      </audio>

      <div :class="{ noActive: buttonActive[1] }">
        <footer class="fixed-bottom text-center">
          <div class="container">
            <span class="text-muted">&copy;2021 YuyaInoue </span>
          </div>
        </footer>
      </div>

    </div>
  `
})
app.mount("#camera");

let sound_on = null
let sound_off = null
let width = 350
let height = 480
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
let header = null
let footer = null
let recorder = null
let record_data = null
let cameraOnButton = null
let cameraOffButton = null
let reRecordButton = null
let cameraButtonArea = null
let confirmVideo = null
let backButtonArea = null
let downloadButton = null
let attrtibuteArray = ['noActive','cameraOn']
let dataMessage = null
let mimeType = null
//let ext = null
/**
* ユーザーのデバイスによるカメラ表示を開始し、
* 各ボタンの挙動を設定する
*
*/
function startup() {
  video = document.getElementById('camera')
  videoStart()

  video.addEventListener('canplay', function(ev){
  if (!streaming) {
    streaming = true
  }
  }, false)

  startRecorder()
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
    console.log('isTypeSupported:')
    console.log(MediaRecorder.isTypeSupported("video/mp4"));
    if(MediaRecorder.isTypeSupported("video/mp4")){
      mimeType = "video/mp4"
      //ext = "mp4"
    }
    else{
      mimeType = "video/webm; codecs = h264"
      //ext = "webm"
    }
    recorder = new MediaRecorder(stream, { mimeType : mimeType })
    recorder.ondataavailable = function (e) {
      var confirm = document.getElementById('confirm')
      confirm.setAttribute('controls', '')
      confirm.setAttribute('width', width)
      confirm.setAttribute('height', height)
      var outputdata = window.URL.createObjectURL(e.data)
      record_data=e.data
      confirm.src = outputdata
    }
    console.log('Start recordr.')
  })
}

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

function removeHeaderFooter(){
  //ヘッダー・フッターの削除
  //header.setAttribute('class', attrtibuteArray[0])
  //footer.setAttribute('class', attrtibuteArray[0])
  //録画のボタンのセット
}
function addHeaderFooter(){
  //header.removeAttribute('class')
  //footer.removeAttribute('class')
}
//TODO: 録画開始の関数
function setRecordOn(){
  //ヘッダー・フッターの非表示化
  removeHeaderFooter();
  //確認画面と投稿フォームの非表示化
  confirmVideo.setAttribute('class', attrtibuteArray[0])
  uploadreRecordButton.setAttribute('class', attrtibuteArray[0])
  //backButtonArea.removeAttribute('class')
  //カメラ画面と録画ボタン、読み上げ文章の表示
  video.removeAttribute('class')
  s = cameraButtonArea.getAttribute('class')
  s = s.replace((' '+attrtibuteArray[0]), '')
  cameraButtonArea.setAttribute('class', s)
  dataMessage.removeAttribute('class')
  //録画開始ボタンを表示、停止ボタンを非表示
  s = cameraOnButton.getAttribute('class')
  s = s.replace((' '+attrtibuteArray[0]), '')
  cameraOnButton.setAttribute('class', s)
  s = cameraOffButton.getAttribute('class')
  s += (' '+attrtibuteArray[0])
  cameraOffButton.setAttribute('class', s)
}
// 録画停止の関数
function setRecordOff(){
  s = cameraOnButton.getAttribute('class')
  s += (' '+attrtibuteArray[0])
  cameraOnButton.setAttribute('class', s)
  s = cameraOffButton.getAttribute('class')
  s = s.replace((' '+attrtibuteArray[0]), '')
  cameraOffButton.setAttribute('class', s)
}
// 再録画の関数
function setReRecord(){
  addHeaderFooter(); //ヘッダー・フッターの表示
  //録画ボタンを非表示に
  s = cameraButtonArea.getAttribute('class')
  s += (' '+attrtibuteArray[0])
  cameraButtonArea.setAttribute('class', s)
  //backButtonArea.setAttribute('class', attrtibuteArray[0])
  //カメラと読み上げ文章を非表示に
  video.setAttribute('class', attrtibuteArray[0])
  dataMessage.setAttribute('class', attrtibuteArray[0])
  // 録画内容と動画の投稿フォームを表示
  confirmVideo.removeAttribute('class')
  uploadreRecordButton.removeAttribute('class')
  //ストリームのoff
  video.srcObject = null
}

// 録画機能のセットアップ
function setup(){
  //ヘッダー・フッターを非表示
  //header = document.getElementById('header')
  //footer = document.getElementById('footer')
  removeHeaderFooter();
  //録画内容ダウンロードボタン
  downloadButton = document.getElementById("downloadButton")
  //カメラ起動・停止の合図の音声
  sound_on = document.getElementById('sound_on')
  sound_off = document.getElementById('sound_off')
  //録画開始のイベントの定義
  dataMessage = document.getElementById("dataMessage")
  cameraButtonArea = document.getElementById("cameraButtonArea")
  cameraOnButton = document.getElementById("cameraOnButton")
  cameraOffButton = document.getElementById('cameraOffButton')
  s = cameraOffButton.getAttribute('class')
  s += (' '+attrtibuteArray[0])
  cameraOffButton.setAttribute('class', s)
  reRecordButton = document.getElementById("reRecordButton")
  //録画内容の確認画面の要素を獲得
  confirmVideo = document.getElementById('confirmArea')
  confirmVideo.setAttribute('class', attrtibuteArray[0])
  uploadreRecordButton = document.getElementById('uploadreRecordButton')
  uploadreRecordButton.setAttribute('class', attrtibuteArray[0])
  //backButtonArea = document.getElementById("backButtonArea")

  //録画開始ボタンのイベントの定義
  cameraOnButton.addEventListener('click', function (ev){
    //録画onボタンの挙動
    setRecordOff();
    //録画開始
    sound(sound_on);
    recorder.start()
    ev.preventDefault()
  }, false);

  //録画停止のイベント定義
  cameraOffButton.addEventListener('click', function (ev){
    //録画の停止
    recorder.stop()
    sound(sound_off)
    setReRecord();
  })

  //再録画のイベント定義
  reRecordButton.addEventListener('click', function (ev){
    setRecordOn();
    startup();
  })

  //ダウンロードのイベント定義
  downloadButton.addEventListener('click', function (ev){
    console.log(record_data)
    var blob = new Blob([record_data], { type: mimeType })
    window.URL = window.URL || window.webkitURL;
    var URL = window.URL || window.webkitURL;
    var createObjectURL = URL.createObjectURL || webkitURL.createObjectURL;
    var url = createObjectURL(blob)
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display:none'
    a.href = url;
    var time = Date.now();
    a.download = (time)
    a.click();
    window.URL.revokeObjectURL(url);
  })
  startup();
  console.log('Complete setup.')
}
setup();

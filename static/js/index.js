const video = document.getElementById('video');

var socket = io.connect('https://faceemotionrecognition.fly.dev');

socket.on( 'connect', function() {
  console.log("SOCKET CONNECTED")
})

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
Promise.all([
  faceapi.loadFaceLandmarkModel("https://faceemotionrecognition.fly.dev/static/models/"),
  faceapi.loadFaceRecognitionModel("https://faceemotionrecognition.fly.dev/static/models/"),
  faceapi.loadTinyFaceDetectorModel("https://faceemotionrecognition.fly.dev/static/models/"),
  faceapi.loadFaceLandmarkModel("https://faceemotionrecognition.fly.dev/static/models/"),
  faceapi.loadFaceLandmarkTinyModel("https://faceemotionrecognition.fly.dev/static/models/"),
  faceapi.loadFaceRecognitionModel("https://faceemotionrecognition.fly.dev/static/models/"),
  faceapi.loadFaceExpressionModel("https://faceemotionrecognition.fly.dev/static/models/"),
])
  .then(startVideo)
  .catch(err => console.error(err));

function startVideo() {
  console.log("access");
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

	console.log(detections)

	socket.emit( 'my event', {
      data: detections
    })

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    console.log(detections);
  }, 100)
})

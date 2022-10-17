import cv2

class Camera():
    def __del__(self):
        self.video.release()

    def get_frame(self):
        self.video = cv2.VideoCapture(0)
        success, image = self.video.read()
        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from camera import Camera

app = FastAPI()

def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.get('/video_feed', response_class=StreamingResponse)
async def video_feed():
    return StreamingResponse(gen(Camera()), media_type='multipart/x-mixed-replace; boundary=frame')

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return """
        <html>
            <head>
                <title>Face Recognition Image</title>
            </head>
            <body>
                <h1 text_align=center>Video Streaming Demonstration</h1>
                <img id="bg" width=70% height=90% src="/video_feed">
            </body>
        </html>
    """

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

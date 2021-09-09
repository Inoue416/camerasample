from flask import (
    redirect, render_template, request, url_for, session, make_response, jsonify,
)
from flask import Flask
import re
import os

app = Flask(__name__, static_url_path='/static')
app.config['DEBUG'] = True
@app.route('/')
def index():
    return render_template('index.html', message="私は大学生です")
@app.route('/hello')
def hello():
    return 'hello world'
@app.route('/record')
def record():
    return render_template('record.html', file_id="t_v0", data="サンプルです")

@app.route('/save_tweet/<file_id>', methods=['POST'])
def save_tweet(file_id):
    UPLOAD_PATH = './video'
    video = request.files['video']
    exd = re.findall(r'\.\w*', video.filename)
    filename = UPLOAD_PATH + (('/{}_{}{}').format(file_id, 0, exd[0]))
    videoname = (('{}_{}{}').format(file_id, 0, exd[0]))
    video.save(os.path.join(UPLOAD_PATH, videoname))
    if '.webm' in exd:
        exd = ['.mp4']
        os.system("ffmpeg -i {} {}".format(filename, (os.path.join(UPLOAD_PATH, videoname.replace('.webm', '.mp4')))))
    #upload_drive(foldername=file_id, videopath=filename, videoname=videoname)
    #os.remove(filename)
    resp = make_response(redirect('/'))
    return resp

if __name__ == '__main__':
    app.run()

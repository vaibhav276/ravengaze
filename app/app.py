from flask import Flask, send_from_directory
app = Flask(__name__)

@app.route("/ravengaze")
def hello():
    return send_from_directory('static', 'index.html')

@app.route('/ravengaze/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0', port=5000)

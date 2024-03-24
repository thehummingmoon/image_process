from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Read the uploaded image
    img = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # Perform object detection (replace this with your actual object detection code)
    car_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_car.xml')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cars = car_cascade.detectMultiScale(gray, 1.1, 2)

    # Count the number of detected vehicles
    num_vehicles = len(cars)

    # Encode processed image to base64 for display
    _, encoded_image = cv2.imencode('.jpg', img)
    processed_image_base64 = encoded_image.tobytes().decode('utf-8')

    return jsonify({'num_vehicles': num_vehicles, 'processed_image': processed_image_base64})

if __name__ == '__main__':
    app.run(debug=True)

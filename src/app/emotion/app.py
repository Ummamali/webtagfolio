from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np


app = Flask(__name__)
CORS(app)
current_dir = os.path.dirname(os.path.abspath(__file__))
cascade_path = os.path.join(current_dir, 'haarcascade_frontalface_default.xml')
model_path = os.path.join(current_dir, 'model_v_47.hdf5')
classifier = load_model('C:\Users\New\Desktop\Things\Tagfolio\emotionBackend\model_v_47.hdf5')
face_classifier = cv2.CascadeClassifier(
    './haarcascade_frontalface_default.xml')
class_labels = {3: 'Happy', 4: 'Neutral', 5: 'Sad'}


@app.route('/emotion', methods=['POST'])
def analyze_emotion():
    try:

        # Receive the image from the request
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
        image_file = request.files['image']
        nparr = np.frombuffer(image_file.read(), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        faces = face_classifier.detectMultiScale(gray, 1.3, 5)
        results = []
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48),
                                  interpolation=cv2.INTER_AREA)

            # Preprocess the face image
            roi = roi_gray.astype("float") / 255.0
            roi = img_to_array(roi)
            roi = np.expand_dims(roi, axis=0)

            # Predict the emotion
            preds = classifier.predict(roi)[0]
            if preds.argmax() in class_labels:
                emotion = class_labels[preds.argmax()]
            else:
                emotion = 'Not Defined'

            results.append(
                {'x': x, 'y': y, 'w': w, 'h': h, 'emotion': emotion})

        # Return the analysis result
        return jsonify({'Emotion': emotion}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

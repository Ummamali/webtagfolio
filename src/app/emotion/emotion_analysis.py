import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np

face_classifier = cv2.CascadeClassifier('./backend/Harcascade/haarcascade_frontalface_default.xml')
classifier = load_model("F:/Assignments/FYP/FYP I/SDS/test/test/webtagfolio/src/app/emotion/model_v_47.hdf5")
class_labels = {3: 'Happy', 4: 'Neutral', 5: 'Sad'}

def analyze_emotion(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    allfaces = []
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
        allfaces.append(roi_gray)

    emotions_detected = []
    for face in allfaces:
        roi = face.astype("float") / 255.0
        roi = img_to_array(roi)
        roi = np.expand_dims(roi, axis=0)
        preds = classifier.predict(roi)[0]
        if preds.argmax() in class_labels:
            label = class_labels[preds.argmax()]
            emotions_detected.append(label)

    return ', '.join(emotions_detected)

if __name__ == '__main__':
    import sys
    image_path = sys.argv[1]  # Path to the image received from Flask
    emotions = analyze_emotion(image_path)
    print(emotions)

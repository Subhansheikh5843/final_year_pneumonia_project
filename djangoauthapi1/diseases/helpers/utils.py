import os
import cv2
import random
import tensorflow as tf
import numpy as np 
from PIL import Image


def generate_unique_filename(original_filename):
    random_number = random.randint(100000, 99999999)
    base_name, ext = os.path.splitext(original_filename)
    return f"{base_name}_{random_number}{ext}"


def preprocess_image(image_path, target_size=(299, 299)):
        img = Image.open(image_path)
        img = img.resize(target_size)
        # Convert the image to a numpy array
        img_array = np.array(img) / 255.0  # Normalize pixel values to [0, 1]
        # If the image has only one channel (grayscale), convert it to 3 channels (RGB)
        if len(img_array.shape) == 2:  # Grayscale image (height, width)
            img_array = np.stack([img_array] * 3, axis=-1)  # Stack 3 times along the last axis to make it (height, width, 3)
        elif img_array.shape[2] == 3:  # RGB image (height, width, 3)
            pass  # Already in the correct shape (height, width, 3)
        # Add batch dimension to make it (1, height, width, 3)
        img_array = np.expand_dims(img_array, axis=0)     
        return img_array


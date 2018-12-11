import pickle
import os
import numpy as np
import pyaudio
import wave
from sys import byteorder
from array import array
from struct import pack
from scipy.io.wavfile import read
from sklearn.mixture import GaussianMixture as GMM
from audio_features import extract_features
from read_live_audio import record_to_file
import sounddevice as sd
import warnings
warnings.filterwarnings("ignore")

source_path = os.path.join(os.getcwd(), "Data/Training")    # Path to Training Data
models_path = "Data/Models"                                 # Path to Trained Models

# Create Custom Data
train_data_added = 0
while (1):
    print ("1. Record  |  2. Exit")
    if (int(input()) == 1):
        print ("\tInput Name of the Class: ")
        this_class = input()
        print ("\t== Recording the sample (15 Seconds Approximately)")
        record_to_file(os.path.join(os.path.join(source_path, this_class), "train_sample"+str(train_data_added+1)+".wav"), chunkSize=512, rate=16000)
        print ("\tAdded the Sample!")
        train_data_added += 1
    else:
        print ("\tTrain Data Added: ", train_data_added)
        break


# Train from Data
class_labels = os.listdir(source_path)                      # Labels of all Classes
n_classes = len(class_labels)                               # Number of Classes

print ("Classes: ", class_labels)

# Feature Extraction and Creating Models
for this_class in class_labels:
    print ("\n============================================\nClass: " + this_class)
    this_class_training_path = os.path.join(source_path, this_class)
    this_class_training_samples = [os.path.join(this_class_training_path, x) for x in os.listdir(this_class_training_path)]

    features = np.asarray(())
    for index, sample_path in enumerate(this_class_training_samples):
        print ("\tTrain File: ", sample_path)

        sr, audio = read(os.path.join(source_path, sample_path))    # Read Audio and Rate
        print ("\tRate: ", sr)

        vector = extract_features(audio, sr)                        # Extract 40 Dimensional Features (MFCC & delta MFCC)
        print ("\tVector Shape: ", np.array(vector).shape)

        if features.size == 0:
            features = vector
        else:
            features = np.vstack((features, vector))

        # Concatenate all features from all Training Source Data Files, then Finally Train Model
        if (index+1 == len(this_class_training_samples)):
            gmm = GMM (n_components = 16, covariance_type='diag',n_init = 3) #, n_iter = 200
            gmm.n_iter = 20
            gmm.fit(features)
            picklefile = this_class + ".gmm"
            pickle.dump(gmm, open(os.path.join(models_path, picklefile),'wb'))           # Dumping Trained Model into Pickle
            print ("\n\tClass Label: ", picklefile.split('.')[0], " | Features Shape = ", features.shape)
            features = np.asarray(())


print ("\nTraining Complete!")

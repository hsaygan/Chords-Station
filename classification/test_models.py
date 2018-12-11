import os
import pickle
import numpy as np
import pandas as pd
from scipy.io.wavfile import read
from audio_features import extract_features
from read_live_audio import record_to_file
import warnings
warnings.filterwarnings("ignore")
import time

source_path = os.path.join(os.getcwd(), "Data/Testing")                      # Path to Training Data
models_path = os.path.join(os.getcwd(), "Data/Models")                       # Path to Trained Models
test_recordings_path = os.path.join(os.getcwd(), "Data/Test_Recordings")     # Path to Test Recordings
class_labels = os.listdir(source_path)                                       # Labels of all Classes
n_classes = len(class_labels)                                                # Number of Classes

# Load the Gaussian Models
models_full_path = [os.path.join(models_path, x) for x in os.listdir(models_path)]
models = [{'model': pickle.load(open(x, 'rb')), 'label': os.path.basename(x).split('.')[0]} for x in models_full_path]
results = pd.DataFrame(columns=[os.path.basename(x) for x in models_full_path] + ['Classification'])

if (len(models) != n_classes):
    print ("Error! Number of Models not same as the number of Classes in 'Testing Data'!")
    class_labels = [model['label'] for model in models]     # Only consider classes whose models are available
else:
    class_labels = [model['label'] for model in models]     # Override class_labels to fit class labels index vise, similar to in models

print ("Classes: ", class_labels)
print ("Models: ", models)

# Feature Extraction and Classification
for this_class in class_labels:
    print ("\n============================================\nClass: " + this_class)
    this_class_testing_path = os.path.join(source_path, this_class)
    this_class_testing_samples = [os.path.join(this_class_testing_path, x) for x in os.listdir(this_class_testing_path)]
    # print ("This Class Testing Samples:", this_class_testing_samples)

    for sample_path in this_class_testing_samples:
        print ("\n\tTest File: ", sample_path)

        sr, audio = read(os.path.join(source_path, sample_path))    # Read Audio and Rate
        vector = extract_features(audio, sr)                        # Extract 40 Dimensional Features (MFCC & delta MFCC)
        print ("\tVector Shape: ", np.array(vector).shape)
        log_likelihood = np.zeros(len(models))

        # Checking Score with each Model
        for i in range(len(models)):
            gmm    = models[i]['model']
            scores = np.array(gmm.score(vector))
            print ("\t\tModel '", models[i]['label'], "' Scores: ", scores)
            log_likelihood[i] = scores.sum()

        chosen_class = np.argmax(log_likelihood)
        log_likelihood_name = ('/').join([sample_path.split('/')[-2], sample_path.split('/')[-1]])
        results.loc[log_likelihood_name] = list(log_likelihood) + [models[chosen_class]['label']]

        print ("\tLog Likelihood: ", log_likelihood)
        print ("\tClassified: ", models[chosen_class]['label'])           # As corresponding indices to Models are the same
        time.sleep(0.5)


print ("1. Test Through Microphone | 2. Exit")
if (int(input()) == 1):
    test_data_added = 0
    while (test_data_added < 5):
        print ("== Recording the sample (5 seconds Approximately)")
        sample_path = os.path.join(test_recordings_path, "test_sample"+str(test_data_added+1)+".wav")
        record_to_file(sample_path, chunkSize=256, rate=16000)
        sr, audio = read(sample_path)
        vector = extract_features(audio, sr)
        log_likelihood = np.zeros(len(models))

        # Checking Score with each Model
        for i in range(len(models)):
            gmm    = models[i]['model']
            scores = np.array(gmm.score(vector))
            print ("\tModel '", models[i]['label'], "' Scores: ", scores)
            log_likelihood[i] = scores.sum()
        chosen_class = np.argmax(log_likelihood)
        log_likelihood_name = ('/').join([sample_path.split('/')[-2], sample_path.split('/')[-1]])
        results.loc[log_likelihood_name] = list(log_likelihood) + [models[chosen_class]['label']]
        test_data_added+= 1

        print ("Log Likelihood: ", log_likelihood)
        print ("Classified: ", models[chosen_class]['label'])           # As corresponding indices to Models are the same

print ("\n======================\nResults: \n", results)
results.to_csv('results.csv', sep=',')
print ("\nTesting Complete!")

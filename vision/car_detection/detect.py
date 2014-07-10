
import numpy as np
import cv2
import pylab as plt

# run prepare.py to create the training set


# to create a vec file from a bunch of samples:
# opencv_createsamples -info info.dat -num 200 -w 24 -h 24 -vec cars.vec

# bg.dat contains the path to negative sample (background only)
# to train:
# opencv_traincascade -data models -vec cars.vec -bg bg.dat -numStages 15 -nsplits 2 -minhitrate 0.999 -maxfalsealarm 0.5 -numPos 200 -numNeg 900 -w 24 -h 24

car_cascade = cv2.CascadeClassifier('models/cascade.xml')

img = cv2.imread('../data/original_images/garidech_146.jpg')
resized_image = cv2.resize(img, (600, 225))

xx,yy = [],[]
cars = car_cascade.detectMultiScale(resized_image)
for (x,y,w,h) in cars:
	xx += [x+w/2.]
	yy += [y+h/2.]
	print ((x,y),(x+w,y+h))

plt.scatter(xx,yy, color="r")
plt.imshow(resized_image)
plt.show()
import glob
import cv2
import pylab as plt
import random


filenames = glob.glob("../data/cars/learning_images/neg/*.pgm")
random.shuffle(filenames)

Nr = 5
Nc = 10

imgs = map(lambda x: cv2.imread(x),filenames)

plt.axis("off")
plt.subplots_adjust(hspace=0.001)
nb = 0
for i in range(1,Nr+1):
    for j in range(1,Nc+1):
        nb+=1
        ax1 = plt.subplot(Nr,Nc,nb)
        ax1.imshow(imgs.pop())
        ax1.get_xaxis().set_visible(False)
        ax1.get_yaxis().set_visible(False)
        ax1.get_xaxis().set_ticks([])
        ax1.get_yaxis().set_ticks([])

plt.show()


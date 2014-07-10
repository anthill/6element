# -*- coding: utf-8 -*-

import numpy as np
import cv2
import pylab as plt
import glob, random, os
import pandas

from shared import *
	
data = pandas.read_csv("../data/bins/manual_estimation.csv", names=["filename", "bin", "amount"])

output = open("../data/bins/train.csv","w")
output.write(",".join(map(str,range(50**2)))+",amount" +"\n")
for i,row in data.iterrows():
	path = "../data/original_images/" + row["filename"]
	name = row["filename"].split("_")[0]
	img = cv2.imread(path, cv2.CV_LOAD_IMAGE_GRAYSCALE)
	warp = bird_view(img, bins[name][row["bin"]])
	resized_image = np.array(cv2.resize(warp, (size, size))).flatten()
	if row["amount"] in set(range(6)):
		output.write(",".join(map(str,list(resized_image)))+","+str(float(row["amount"]))+"\n")

output.close()






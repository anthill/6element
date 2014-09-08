# -*- coding: utf-8 -*-


import pylab as plt
import glob, random, os

from shared import *

files = glob.glob("../data/original_images/*_*.jpg")
random.shuffle(files)

while True:
		filename = files.pop()
		name = filename.split("/")[-1].split("_")[0]
		
		if name in bins.keys():
			available_bins = bins[name].keys()
			for bin in available_bins:
				# plot image plus bird view
				img = cv2.imread(filename)
				warp = bird_view(img, bins[name][bin])

				# an extract around the original image
				[br, bl, tl, tr] = bins[name][bin]
				xmax = max([tr[0],br[0]])
				xmin = min([tl[0], bl[0]])
				ymax = max([br[1],bl[1]])
				ymin = min([tr[1], tl[1]])
				extract = img[ ymin:ymax,xmin:xmax, :]

				plt.close()
				plt.figure(1)
				plt.subplot(211)
				plt.imshow(extract)
				plt.subplot(212)
				plt.imshow(warp)
				
				
				plt.show(block=False)

				# ask for a number 
				fill_factor = input('How filled (0 to 5):')
				# save it 
				output = open("../data/bins/manual_estimation.csv","a")
				output.write(filename.split("/")[-1]+","+bin+","+str(fill_factor)+"\n")
				output.close()



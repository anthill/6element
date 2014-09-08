# -*- coding: utf-8 -*-

import numpy as np
import cv2

# description of the 
bins = {
"garidech" : 
	{"cardboard" : [(1136,274),(1065,260),(1080,182),(1138,197)],
	"mess" : [(1060,207),(987,193),(1030,99),(1074,108)],
	"wood" : [(1011,110),(959,102),(998,48),(1034,55)]
	},

"grenade" : 
	{"green" : [(204,287),(168,296),(195,181),(225,167)],
	"mess" : [(706,239),(657,230),(722,151),(758,157)]
	},

"ramonv": 
	{"cardboard" : [(79,284),(30,297),(65,200),(102,186)],
	"mess" : [(153,190),(107,202),(129,138),(163,132)]
	}
}

# size of the reshaped image
size = 50

def bird_view(img, bbox):

	[br, bl, tl, tr] = bbox
	rect = np.array([tl, tr, br, bl], dtype = "float32")

	widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[0] - bl[0]) ** 2))
	widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[0] - tl[0]) ** 2))
	 
	# ...and now for the height of our new image
	heightA = np.sqrt(((tr[1] - br[1]) ** 2) + ((tr[1] - br[1]) ** 2))
	heightB = np.sqrt(((tl[1] - bl[1]) ** 2) + ((tl[1] - bl[1]) ** 2))
	 
	# take the maximum of the width and height values to reach
	# our final dimensions
	maxWidth = max(int(widthA), int(widthB))
	maxHeight = max(int(heightA), int(heightB))
	 
	# construct our destination points which will be used to
	# map the screen to a top-down, "birds eye" view
	dst = np.array([
	    [0, 0],
	    [maxWidth - 1, 0],
	    [maxWidth - 1, maxHeight - 1],
	    [0, maxHeight - 1]], dtype = "float32")
	 
	# calculate the perspective transform matrix and warp
	# the perspective to grab the screen
	M = cv2.getPerspectiveTransform(rect, dst)
	warp = cv2.warpPerspective(img, M, (maxWidth, maxHeight))

	return warp
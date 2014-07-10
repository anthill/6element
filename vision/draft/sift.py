import numpy as np
import cv2
import pylab as plt

m_iThresholdStepCount = 5
l=2

img = cv2.imread('/Users/vallette/Desktop/imaging/dech3.png',cv2.IMREAD_COLOR)

gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

# # SIFT
# sift = cv2.SIFT()
# kp = sift.detect(gray, None)

# FAST
fast = cv2.FastFeatureDetector()
fast.setInt('threshold',90)
kp = fast.detect(img,None)
print "Threshold: ", fast.getInt('threshold')
print "nonmaxSuppression: ", fast.getBool('nonmaxSuppression')
print "Total Keypoints with nonmaxSuppression: ", len(kp)


# # ORB
# orb = cv2.ORB()
# kp = orb.detect(img, None)
# kp, des = orb.compute(gray, kp)



img=cv2.drawKeypoints(gray,kp)
# img=cv2.drawKeypoints(gray,kp,flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
# cv2.imwrite('sift_keypoints.jpg',img)
plt.imshow(img)
plt.show()
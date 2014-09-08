import cv2
import glob, random, os

size = 50

os.system("rm ../data/cars/learning_images/pos/*")
os.system("rm ../data/cars/learning_images/neg/*")

info = open("models/info.dat","w")

# resizing positive images
for filename in glob.glob("../data/cars/manual_croping/*.jpg"):
	img = cv2.imread(filename)
	height,width,channel  = img.shape
	resized_image = cv2.resize(img, (size, size)) 
	elements = filename.split("/")
	new_filename = "../data/cars/learning_images/" + elements[-1].split(".")[0] + ".pgm"

	cv2.imwrite(new_filename, resized_image)

	info.write("%s 1 0 0 %d %d\n" % (new_filename, size, size))

info.close()
print "Number of files in pos: %s" % str(len(glob.glob("../data/cars/learning_images/pos/*.pgm")))



bg = open("models/bg.dat","w")
# cutting pieces of size*size to make the background
# the 90 first images do not contain cars
for i in range(1, 91):
	img = cv2.imread("../data/original_images/garidech_%s.jpg" % str(i))
	height,width,channel  = img.shape
	for j in range(10):
		x = random.randint(0,height-size)
		y = random.randint(0,width-size)
		croped = img[x:x+size, y:y+size,:]
		croped_filename = "../data/cars/learning_images/neg/garidech_%s_%s.pgm" % (str(i), str(j))
		cv2.imwrite(croped_filename, croped)
		

# # the previous step creates some empty files for unknown reasons
# for file in glob.glob("../data/cars/learning_images/neg/*.pgm"): 
#     if os.stat(file).st_size == 0:
#         os.remove(file)
#     else:
#     	bg.write(file+"\n")
# bg.close()


print "Number of files in neg: %s" % str(len(glob.glob("../data/cars/learning_images/neg/*.pgm")))
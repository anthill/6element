
import numpy as np
import cv2
import pylab as plt
import os.path
import matplotlib.dates as md
import numpy as np
import datetime as dt
import cPickle
import imp

shared = imp.load_source('shared', 'bin_detection/shared.py')

# load models
with open('data/bins/model.pkl', 'rb') as fid:
    regressor = cPickle.load(fid)
with open('data/bins/scaler.pkl', 'rb') as fid:
    scaler = cPickle.load(fid)
car_cascade = cv2.CascadeClassifier('car_detection/models/cascade.xml')

# analyse all images
dates = []
data = {
	"garidech" : 
		{"cars" : [],
		"cardboard" : [],
		"mess" : [],
		"wood" : []
		},

	"grenade" : 
		{"cars" : [],
		"green" : [],
		"mess" : []
		},

	"ramonv": 
		{"cars" : [],
		"cardboard" : [],
		"mess" : []
		}
}


for i in range(1,1170):
	for name in data.keys():
		if name == "garidech":
			dates += [dt.datetime.fromtimestamp(os.path.getmtime(filename))]
		filename = 'data/original_images/%s_%s.jpg' % (name, str(i))
		img = cv2.imread(filename)
		# detect cars
		resized_image = cv2.resize(img, (600, 225))
		cars = car_cascade.detectMultiScale(resized_image)
		data[name]["cars"] += [len(cars)]
		# detect bins
		for bin in shared.bins[name].keys():
			gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
			warp = shared.bird_view(gray_image, shared.bins[name][bin])
			resized_image = np.array(cv2.resize(warp, (shared.size, shared.size))).flatten()
			vec = scaler.fit_transform(resized_image)
			data[name][bin] += [regressor.predict(vec)[0]]



def smooth(x, window_len=11):
    s=np.r_[x[window_len-1:0:-1],x,x[-1:-window_len:-1]]
    w=np.hanning(window_len)
    y=np.convolve(w/w.sum(),s,mode='valid')
    return y


# # plot all affluece
# fig = plt.figure()
# ax = fig.add_subplot(1, 1, 1)
# plt.subplots_adjust(bottom=0.2)
# plt.xticks( rotation=25 )

# xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
# ax.xaxis.set_major_formatter(xfmt)
# for name in data.keys():
# 	y = smooth(data[name]["cars"])[:len(dates)]
# 	ax.plot(dates, y, label=name)
# legend = ax.legend(loc='upper left', shadow=True)
# for label in legend.get_texts():
#     label.set_fontsize('large')


# plot affluence and wastes for one recycle center
name = "grenade"

fig = plt.figure()
# plot affluence
ax = fig.add_subplot(2, 1, 1)
plt.subplots_adjust(bottom=0.2)
plt.xticks( rotation=25 )

xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
ax.xaxis.set_major_formatter(xfmt)
y = smooth(data[name]["cars"])[:len(dates)]
ax.plot(dates, y, label=name)
# plot bins
ax = fig.add_subplot(2, 1, 2)
plt.subplots_adjust(bottom=0.2)
plt.xticks( rotation=25 )

xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
ax.xaxis.set_major_formatter(xfmt)
for waste in data[name].keys():
	if waste != "cars":
		y = smooth(data[name][waste])[:len(dates)]
		ax.plot(dates, y, label=waste)
legend = ax.legend(loc='lower right', shadow=True)
for label in legend.get_texts():
    label.set_fontsize('large')

plt.show()




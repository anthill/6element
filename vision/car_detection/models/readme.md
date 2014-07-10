model obtained with
size = 50
opencv_createsamples -info info.dat -num 200 -w 24 -h 24 -vec cars.vec
opencv_traincascade -data models -vec cars.vec -bg bg.txt -numStages 15 -nsplits 2 -minhitrate 0.999 -maxfalsealarm 0.5 -numPos 200 -numNeg 900 -w 24 -h 24
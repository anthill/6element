# Predictions

Notice here all the scripts given to proceed the prediction of the amount of people for each place.

List of the scripts:

 - `aggregate.py`, a file to build the dataset, with requested features from sensors. Divide the measures in levels.
 - `learn-classification.py`, the first file which will try to predict from the features the level of affluence.
 - `learn-regression.py`, the second file in charge of the prediction, but, in this case, not of the level of affluence, but directly on the number of people.

Also, `learn-classification.py` create a `tree.dot` file which contains the architecture of the built tree. You can convert it in a (large) image using `dot -Tpng tree.dot -o tree.png`.

## Warning

Keep in mind that a first call to the `fetch.py` script (in the parent directory) is needed to process to an aggregation of the data.

Moreover, you'll need [the OpeningHours library of mine](https://github.com/anthill/Python_OpeningHours); please have a look on its own repo to install it.

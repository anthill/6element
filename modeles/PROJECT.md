# The project

[6element](http://6element.fr/) was born from the need to keep a look on the affluence of recycling centers, to make it public, and to suggest people an app to know when it can be a good idea to go throw their waste.

From that, we have build sensors to centralize data on a single server, whose API provides us the collected data from all the recycling centers in public requests. Months have passed, and now, we have enough data to build the root of a prediction model, to make people able to know when it will be interesting going to one of the centers, or when they'll need to go to another because of too many users for the capacity of the center.

As a trainee, and as I really wanted to work around machine learning, my task is to study different ways to predict this affluence, and build an efficient model.

Here the description of the job I did until now:

## First approach with 6element

During my first days, the first things I did were to accommodate myself with the way to work I needed for this project.

In order to show up any incoherent measures from the sensors, I wrote my firsts lines with Python, using `matplotlib`. As I needed it, I also had a first look at the API, and the result of that work gives `analysis/monitor.py` and `analysis/analysis.py`.



## Premises of my prediction model

As I learned how to manipulate data, and how sensors are proceeding their measures, I can know aggregate the first features of my model.

Here the list of the tried features and the way it was expected to affect the prediction:

            Feature          | Expected effect
-----------------------------|----------------
   Season (current month)    | There may be societal factors varying the need to go to a recycling center depending on the period of the year. An example can be the sprint cleaning. Another one is that recycling center's usage isn't the same during summer holidays than the rest of the year.
       Day of the week       | People may be going to a recycling center depending on similars week's schedules.
       Hour of the day       | For the same reason, and maybe also because people don't really need to throw their waste at midnight.
 Opening hours of the center | Because people need to respect the law more than throwing their waste, I think.
           Weather           | Because I thought people won't go to a recycling center during a snowstorm, or even a rainstorm, and because they would prefer to wait to a cleared weather than go during the worst weather.
  Previous hour's affluence  | Because they're unknown common factors that are making people needing to throw waste at same periods of the day. For example: admitting we had an important affluence since the beginning of the day, we can think we would more probably have an important affluence until the rest of this day.

For features that didn't really improve the model, we have the *weather* feature. The reason is people are going to a recycling center when they need it. Thus, predicting the affluence of a recycling center correspond to predict when people will need to throw their waste.

### Tree classifier

The reason why the *weather* feature isn't relevant is probably also the reason why the *season* feature is working well: because some of the people's waste are periodicals (e.g. spring cleaning). However, other needs aren't that periodicals; we cannot predict them as well and say: "Hey! The 21 September, at 11:30, a lot of people will need to go the recycling center!". That's the reason why tree classifier cannot be really improved to make high-level cases be predicted better than with a 50% chances of weel-prediction.

#### Efficiency:

```
Scoring...
   Accuracy: 0.860 (+/- 0.007)

Confusion matrix:
[[9069  381   71]
 [ 446  293   71]
 [  75   71  102]]
```

The confusion matrix can be read as follow:

                        |  Nb low-level predicted | Nb medium-level predicted  | Nb high-level predicted
------------------------|:-----------------------:|:--------------------------:|:------------------------:
   **Nb of low-level**  |          9069           |             381            |           71
 **Nb of medium-level** |           446           |             293            |           71
  **Nb of high-level**  |            75           |              71            |          102


Yes, we can see we have a huge accuracy. 86.0%. In fact, that means 86% of the cases we have are well predicted, *but*, if we have a look at the confusion matrix, we can see that:

 * the great majority of the cases are low-level influence cases we don't really care
 * a majority of high-level cases are not well predicted (146 false positives, for 248 cases measured)
 * we have more than 50% chances of being wrong when we had predict a high-level affluence (102 true positives for 244 high-level cases predicted)
 * majority of medium-level cases are predicted as low-level ones

Considered all of that, classification cannot really help us.

### Regression tree

I also tried a regression tree, but the fact is the worst cases affluence are too rare for the learning. The model may predict well a common case, but the common case is a really low influence, and we want to predict, in order to prepare them, those worst cases influence. So no matter how the mean error is low, as the peaks of affluence are too badly predicted, we must not select this algorithm.

#### Efficiency:

```
Scoring...
    Mean error of 1.79 (+/- 1.00)
 4.67 - 1.56
 4.50 - 1.25
 6.50 - 1.79
     ...
```

The mean error is the square Root Mean Squared Error. It means we can make predictions with a margin of +/- 1.79 for each. Since we are working, here, with the `Nb_measured` field from the `fetch.py`'s requested files, and not with levelized measures, we are not working with previous levels.

The measures printed below are the measures from which ones the prediction is far, with this pattern:
```
reality - predicted
```

As we can see, the badly predicted values are the peaks we precisely wanted to predict; for this reason, a regression tree really can't meet our needs here.


## Next tries and models

The next models we will try are models that aren't predicting if a worst case *will* happen at a specific moment, but what is the probability that it happens knowing all the features. This is a better idea when we cannot have all of the features of a model, or when we consider some of them are random, or are more or less likely to happen.

# The project

[6element](http://6element.fr/) was born from the need to keep a look on the affluence of waste collection sites, to make it public, and to suggest people an app to know when it can be a good idea to go throw their waste.

From that, we have build sensors to centralize data on a single server, whose API provides us the collected data from all the collection sites in public requests. Months have passed, and now, we have enough data to build the root of a prediction model, to make people able to know when it will be interesting going to one of the waste collection site, or when they'll need to go to another because of too many users for the capacity of the center.

As a trainee, and as I really wanted to work around machine learning, my task is to study different ways to predict this affluence, and build an efficient model.

Here the description of the job I did until now:

## First approach with 6element

During my first days, the first things I did were to accommodate my self with the way to work I needed for this project.

As I never touched a Python script of my life, I tried to build plots using `matplotlib`, to show up any incoherent measures from the sensors. As I needed it, I also had a first look at the API, and the result of that work gives `analysis/monitor.py` and `analysis/analysis.py`.

## Premises of my prediction model

As I learned how to manipulate data, and how sensors are proceeding their measures, I can know aggregate the first features of my model.

Here the list of the features I tried and the way I imagined it will affect the prediction:

Feature | Expected effect
--------|----------------
Season (current month) | I think there is societal factors varying the need to go to a recycle center depending on the period of the year. An example can be the sprint cleaning. I also think that recycle center's usage isn't the same during summer holidays than the rest of the year.
Day of the week | I think people are going to a recycle center depending on their week's schedule.
Hour of the day | For the same reason, and maybe also because people don't really need to throw their waste at midnight.
Opening hours of the center | Because people need to respect the law more than throwing their waste, I think.
Weather | Because I think people won't go to a recycle center during a snowstorm, or even a rainstorm, and because they would prefer to wait to a cleared weather than go during the worst weather.
Previous hour's affluence | Because I think they're common factors I didn't found that are making people needing to throw waste at same periods of the day. Admitting we had an important affluence since the beginning of the day, we can think we would really probably have an important affluence until the rest of this day.

For the features that didn't really improve the model, we have the *weather* feature. The reason I found is the reason we argued against me: people are going to a recycle center when they need it. Thus, predicting the affluence of a recycle center correspond to predict when people will need to throw their waste.

That's, I think, why the *season* feature is working well: because some of the people's waste are periodicals (e.g. spring cleaning). However, other needs aren't that periodicals; we cannot predict them as well and say: "Hey! The 21 September, at 11:30, a lot of people will need to go the recycle center!". That's the reason why I cannot really improve my tree classifier, and predict better the worst case affluence than with a 50% chances of prediction.
(Have a look at the *confusion matrix*, during the execution of the `prediction/learn-classification.py` for further information about the errors.)

I also tried a regression tree, but the fact is the worst cases affluence are too rare for the learning. The model may predict well a common case, but the common case is a really low influence, and we want to predict, in order to prepare them, those worst cases influence. So no matter how the mean error is low, as the peaks of affluence are too badly predicted, we must not select this algorithm.

## Next tries and models

The next models I'll try are models that aren't predicting if a worst case *will* happen at a specific moment, but what is the probability that it happens knowing all the features. This is a better idea when we cannot have all of the features of a model, or when we consider some of them are random, or are more or less likely to happen.

# Models

Here the description of some of the models I found and why are they interesting in the objective to predict affluence for recycling center.

## [Bayesian method](https://en.wikipedia.org/wiki/Bayesian_inference)

The Bayesian method is a way to learn probabilities from patterns, and to gradually improve the quality of the statistics as we have more data.

[It's a way to say](http://fastml.com/bayesian-machine-learning/): "oh, so this event happened at this moment. Known that, the probability of the happening of our target is...".

This can be an interesting approach as we have better data to predict affluence over time ([I mentioned here including the previous hour's affluence improved the prediction](PROJECT.md)); moreover, it's a model that learn from previous cases to compute the probability. However, that's a model which can't estimate correctly unknown cases, and as we don't have a lot of measures (time features are based on the current's period of the year, and as we don't have a year of measures, some of time features values were never met yet), Bayesian may tell there is a 0% chances for our target's event to happen. Same problem if we only have a single measure including this case: either we have a 0% chances, or a 100% chances, only depending on what happened during the previous case with the same features.

## [Predicting rare events in event sequences](http://storm.cis.fordham.edu/~gweiss/papers/kdd98.pdf)

It's a way to predict rare events when they have common origins with known specific patterns, over time.

Here, it's needed in order to predict equipment failure, by recognizing a pattern in operating errors, over time. It's a genetic algorithm which learns from those patterns in order to gradually reduce mean error over generations.

It can't be a good approach as we only have a pattern based on previous affluence; moreover as we can add several other features to the pattern (including date features), I think it can learn well.

However, I have the same remark for the Bayesian method. A more efficient way would be to find the origin of the affluence more than trying to guess it from other consequences (in the present case, those patterns), and not by predicting the event, but by predicting the probability of this event.

## [Extreme value analysis](https://www.wikiwand.com/en/Extreme_value_theory)

We have two methods described here.

* The first one relies on generation of an **Annual Maxima Series**, then deriving it;
* The second one, the **Peak Over Threshold** relies on extraction of the peaks. 

### Annual Maxima Series

Coupled with a [generalized extreme value distribution](https://www.wikiwand.com/en/Generalized_extreme_value_distribution), we can fit peaks.

However, as deriving the initial curve of affluence is permitting to learn from variation of the curve; here, people won't come gradually, and reaching a maximum after a large period of time "increasing" continuously. We have a discontinuous curve; deriving isn't the problem, but the derivative should be meaningless since the amount of people really fluctuate in the recycling centers.

### Peak Over Threshold

This algorithm is creating two distributions to fit: the first one is the frequency of the events in a given period of time; the second one is the size of the peaks.

The [Poisson distribution](https://www.wikiwand.com/en/Poisson_distribution) can be used to fit the first curve, while the [generalized Pareto distribution](https://www.wikiwand.com/en/Generalized_Pareto_distribution) can be used to predict the size of the peak. As we have predicted the probability to the happening of an higher-affluence case with the first curve, we can after try to predict in numbers the influence for the concerned period of time.

I didn't find any inconvenience using this algorithm for the moment.

## [Cost-sensitive classifier](https://www.quora.com/I-have-an-imbalanced-dataset-with-two-classes-Would-it-be-considered-OK-if-I-oversample-the-minority-class-and-also-change-the-costs-of-misclassification-on-the-training-set-to-create-the-model/answer/Shehroz-Khan-2)

It's a simple classifier algorithm with weighted classes. This allows to give more or less importance to each classes. It would bring the ability to have a better fitting according the most important classes.

The inconvenience is, anyway, we don't have a lot of data. So, even if we are fitting better higher-affluence classes, we can't know every cases. Admitting there is similar patterns between previous higher-affluence cases and the future unknown ones, but not exactly the same, an algorithm which estimates probability of happening, and not an algorithm which will predict if that would happen or not is more tolerant, and more flexible.

## [One-class classification](https://www.quora.com/I-have-an-imbalanced-dataset-with-two-classes-Would-it-be-considered-OK-if-I-oversample-the-minority-class-and-also-change-the-costs-of-misclassification-on-the-training-set-to-create-the-model/answer/Shehroz-Khan-2)

This is based on the idea of training the algorithm with the majority class (here the lower-affluence classes) and test it on the class that interests us (here the higher-affluence classes).

I don't really understand how it can be efficient so I can't tell any of the advantages or inconveniences.

## [Logistic regression](https://www.wikiwand.com/en/Logistic_regression)

It's a regression algorithm that learns happening probability of an event, as we can see on the linked page.

The inconvenience is, the way the achieved learning on the examples, we can't really have a linear feature that increases probability as it's increasing (like the probability to pass an exam depending on the hours passed to learn).

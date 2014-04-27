#Binful

## Predictive model

To run the predicitve algorithm on your computer:

```
git clone 
cd 
make download-data
```

this will dowload the code dans the data you need.
Then start an ipython console and use 

```
%run contextualize.py
```

which will merge the datasets into a learning dataset and saved it to `learning_table.csv.gz`.

Finally, you can start the learning process (be sure to specify how many days of prediction you need before).

```
%run learn.py
```

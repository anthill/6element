## Scope

6element is a open innovation project of waste optimisation.


### Contributing

#### Getting started

Initialization

````
git clone git@github.com:anthill/6element.git
cd 6element
npm install
docker pull postgres:9.4
````







### Presentation 

The slides describing the projects are in this folder.

### Get the data

Just do `make get-data` to download all the necessary datasets.

### Dashboard

In `dashboard` you'll find the front end of the visualisation dashboard.

```
make dashboard
```

to launch the interface then visible in your browser at `http://localhost:8000/`

### Learning algo

In `predict` lies the learning algorithm. Once you get the data, enter the ipython prompt and use:

```
%run contextualize.py
%run learn.py
```

### Computer vision

The algorithm concerning the computer vision part are in `vision`.
You can use the car detector or the bin detector individually, but for a complete analysis use:

```
%run analyse_all.py
```




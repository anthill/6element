# Analysis tools

A set of tools to manage and monitor any irregularity in the set of data (via the API).

### Prerequisites

You need to fill your `PRIVATE.json` file first, at the root of the repository.

The `fetch.py` script needs the `data_source` and `secret` fields from the configuration.


## `fetch.py`

This script is loading all the needed json data in order to keep them offline to use them in the other sripts.

A first execution is *required* before you can use other scripts.

### Usage:

`./fetch.py`


## `analysis/monitor.py`

A small script that extracts and print into the standard output the hours when too many (or not enough) measures were taken (in case of duplication, in case of loss of data, or simply in case of bad data).

It creates a graph with `matplotlib` displaying number of measures by hours, each day as a curve.

### Usage:

`./monitor.py captor_id`


## `analysis/analysis.py`

This script monitors each captor referenced by the API, creating a JSON containing, for each captor:

 * its id
 * the place it is relative to
 * the 10 maximum amounts of WiFi devices measured the whole time, with their dates
 * an array of 24 measures by day (up to 300 days), each containing:
   * an expected number of measures (depending of the opening hours of the center)
   * a real number of measures got
   * the number of uniques measures (excluding duplicates)
   * the maximum amount of WiFi devices measured in the hour

The script also creates a CSV, containing the maximum number of WiFi devices measured by day, by captor.

Those JSON datas are save in the file given as first argument, while CSV in the second one. If no CSV file was given in argument, keep only JSON datas.

### Usage:

`./analysis.py json_output [csv_output]`


## `prediction/*`

Please have a look at [the other README](prediction/README.md).

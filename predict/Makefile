DATA_DIR=data


all: download-data
.PHONY: download-data

download-data:
	@rm -rf $(DATA_DIR)
	@mkdir -p $(DATA_DIR)
	@wget -P $(DATA_DIR)/ http://catalogue.datalocale.fr//storage/f/2014-04-26T222427/temporal_daily.csv
	@wget -P $(DATA_DIR)/ http://catalogue.datalocale.fr/storage/f/2013-04-02T094729/Opendata_Decheteries_v2.csv
	@wget -P $(DATA_DIR)/ http://catalogue.datalocale.fr//storage/f/2014-04-26T230144/french_communes_indicators.gz


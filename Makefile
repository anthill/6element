
BLENDER_DIR=/Applications/blender.app/
DATA=/Users/vallette/Desktop/RL/tile_x119y112/

all: convert
.PHONY: convert


get-data:
	cd predict && make

dashboard:
	cd dashboard && python -m SimpleHTTPServer 8000


learn:
	cd predict && tsc *.ts --sourcemap -w




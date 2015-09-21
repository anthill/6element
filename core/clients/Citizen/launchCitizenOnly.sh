npm install
node_modules/gulp/bin/gulp.js

node_modules/browserify/bin/cmd.js -t reactify core/clients/Citizen/src/main.js -o /6element/core/clients/Citizen-browserify-bundle.js

docker run -d \
	-v $PWD:/6element \
	-v /data/2life/scrapping:/6element/core/database/fileData \
	-e VIRTUAL_HOST=citizen.ants.builders \
	-e VIRTUAL_PORT=3500 \
	-p 3500:3500 \
	-w /6element/core/server/ \
	--name="citizen" \
	ants/nodejs:v1 \
	node citizen.js

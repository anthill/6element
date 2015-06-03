FROM ants/nodejs:v1
MAINTAINER Alexandre Vallette <alexandre.vallette@ants.builders>

# pending https://github.com/docker/docker/issues/7511
COPY package.json /6element/
COPY client /6element/client/
COPY database /6element/database/
COPY server /6element/server/
COPY utils /6element/utils/

WORKDIR /6element

RUN npm install
RUN npm run build
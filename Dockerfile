FROM ants/nodejs:v1
MAINTAINER Alexandre Vallette <alexandre.vallette@ants.builders>

# RUN npm install nodemon -g

RUN mkdir /6element
WORKDIR /6element
ADD package.json /6element/package.json

RUN npm install
RUN npm run watch
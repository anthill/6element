FROM ants/nodejs:v1
MAINTAINER Alexandre Vallette <alexandre.vallette@ants.builders>

RUN npm install gulp -g

RUN mkdir /6element
WORKDIR /6element

COPY ./package.json /6element/package.json
RUN npm install
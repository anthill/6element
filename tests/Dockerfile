# This Dockerfile builds a container with CasperJS, PhantomJS, and NodeJS

FROM cmfatih/phantomjs

MAINTAINER Romain Crestey <romain.crestey@ants.builders>

RUN apt-get update && apt-get install -y \
	build-essential \
	curl

RUN curl -sL https://deb.nodesource.com/setup | bash -

RUN apt-get update && apt-get install -y nodejs 

RUN npm install -g browserify

RUN npm install forever -g
RUN npm install nodemon -g

RUN mkdir /tests
WORKDIR /tests

COPY ./package.json /tests/package.json
RUN npm install

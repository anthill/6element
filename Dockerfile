FROM ants/nodejs:v1
MAINTAINER Alexandre Vallette <alexandre.vallette@ants.builders>

RUN mkdir /6element
WORKDIR /6element

# install pgdump and related
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
RUN apt-get install -y wget ca-certificates
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y postgresql-9.4 

COPY ./package.json /6element/package.json

RUN npm install
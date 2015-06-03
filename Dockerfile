FROM ants/nodejs:v1
MAINTAINER Alexandre Vallette <alexandre.vallette@ants.builders>

# RUN npm install nodemon -g

RUN mkdir /6element

COPY package.json /6element/		
COPY client /6element/client/		
COPY database /6element/database/		
COPY server /6element/server/		

WORKDIR 6element
RUN npm install
RUN npm run build
FROM ubuntu:latest
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt update
RUN apt install -y apt-utils
RUN apt upgrade -y
RUN apt install -y openjdk-17-jdk
RUN apt install -y openjdk-17-jre
RUN apt install bash
RUN apt install -y curl
RUN touch /root/.bashrc
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
ENV NVM_DIR $HOME/.nvm
ENV NODE_VERSION 17.9.1

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
COPY Lavalink.jar ./
COPY application.yml ./
RUN nohup java -jar Lavalink.jar & disown
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 4200
EXPOSE 2333

RUN npm run deploy

CMD nohup java -jar Lavalink.jar & disown; npm run start

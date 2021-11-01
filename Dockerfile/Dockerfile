FROM node:16-bullseye

#copy scripts
ADD init.sh /usr/local/bin/init.sh
ADD start.sh /usr/local/bin/start.sh
VOLUME [ "/config" ]

#Execute init script by default on container startup
CMD ["/bin/bash", "/usr/local/bin/init.sh"]

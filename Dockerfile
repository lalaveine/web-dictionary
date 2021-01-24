FROM node:7.5-slim

COPY server.js /server.js

EXPOSE 8080

CMD [ "node", "server.js" ]

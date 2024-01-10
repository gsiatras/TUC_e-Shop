FROM node:20.10.0

WORKDIR /TUC_e-Shop/order_service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm", "start"]

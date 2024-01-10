FROM node:20.10.0

WORKDIR /TUC_e-Shop/product_service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3007

CMD ["npm", "start"]

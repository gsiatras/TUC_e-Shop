import { Kafka, Partitioners } from 'kafkajs';
import { handleOrders } from './orderService.js';

const kafka = new Kafka({
  clientId: 'order-app',
  brokers: ['172.17.0.1:8097'],
  retry: {
    initialRetryTime: 2000,
    retries: 5
  }
})

const producer = kafka.producer({
    allowAutoTopicCreation: true,
    createPartitioner: Partitioners.LegacyPartitioner
})

const sendOrders = async (msg) => {
  await producer.connect()
  await producer.send({
    topic: 'ordersProducer',
    messages: [{
      value: JSON.stringify(msg)
    }]
  })

  await producer.disconnect()
}

const consumer = kafka.consumer({
    groupId: "orders-group",
    allowAutoTopicCreation: true,
  });
  

// Check order status and handle orders
async function checkOrderStatus() {
    try {
        await consumer.connect();

        await consumer.subscribe({ topics: ["productsProducer"] });

        await consumer.run({
        eachMessage: async ({ message }) => {
            const jsonMsg = JSON.parse(message.value);
            handleOrders(jsonMsg);  
        },
        });
    } catch (error) {
        await consumer.disconnect();
        console.error("Error in checkOrderStatus:", error.message);
    }
}


// kafka.js
export default {
    kafkaProducer: sendOrders
  };
  
setTimeout(async ()=>{
    try {
        await checkOrderStatus();
    } catch (error) {
        console.log(error.message)
    }
},2000)

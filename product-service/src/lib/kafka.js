import { Kafka, Partitioners } from 'kafkajs';
import { handleProducts } from './productService.js';



const kafka = new Kafka({
  clientId: 'products-app',
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

const sendOrders = async (msg)=>{
    await producer.connect()
    await producer.send({
        topic: 'productsProducer',
        messages: [{
            value: JSON.stringify(msg)
        }]
    })
    console.log('sent back');

    await producer.disconnect()
}

const consumer = kafka.consumer({
    groupId: "products-group",
    allowAutoTopicCreation: true,
})

const fetchProductsFromOrderTopic = async ()=>{
  try {
    await consumer.connect()
    await consumer.subscribe({topics: ["ordersProducer"]})

    await consumer.run({
      eachMessage: async ({message}) => {
        const jsonMsg = JSON.parse(message.value);
        //const result = await handleProducts(jsonMsg);
        //console.log(jsonMsg);
        
        const result = await handleProducts(jsonMsg);

        const statusMessage = {
            id: jsonMsg.id,
            status: result ? "Success" : "Rejected",
          };
        console.log('finished');
          // Pass the order status to order service
        await sendOrders(statusMessage);

      }
    })
  } catch (error) {               
    await consumer.disconnect()
    console.log(error.message)
  }
}

setTimeout(async ()=>{
  try {
    await fetchProductsFromOrderTopic()
  } catch (error) {
    console.log(error.message)
  }
},2000)
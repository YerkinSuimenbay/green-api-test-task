import { M1_QUEUE, M2_QUEUE } from './constants';
import { getConnectionAndChannel } from './rmq';

function processData(data: unknown) {
	console.log('DATA RECEIVED: ', data);
	console.log('PROCESSING THE DATA... ');

	const date = new Date().toLocaleString();

	const processedData = {
		date,
		msg: 'Hello from M2',
		receivedData: data,
	};

	return processedData;
}

async function sendToM1(answer: unknown) {
	try {
		const { connection, channel } = await getConnectionAndChannel();
		const queue = M1_QUEUE;

		await channel.assertQueue(queue, { durable: false });
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(answer)));
		console.log('Answer sent to M1:', answer);

		setTimeout(() => {
			connection.close();
		}, 500);
	} catch (error) {
		console.error('Error sending answer to M1:', error);
	}
}

async function listenToM1() {
	try {
		const { channel } = await getConnectionAndChannel();
		const queue = M2_QUEUE;

		await channel.assertQueue(queue, { durable: false });
		channel.consume(
			queue,
			(msg) => {
				if (!msg) return;
				const data = JSON.parse(msg.content.toString());
				const answer = processData(data);
				sendToM1(answer);
			},
			{
				noAck: true,
			}
		);
	} catch (error) {
		console.error('Error listening for data from M1:', error);
	}
}

function main() {
	console.log('M2 is up and running...');

	// Start listening for incoming data from M1
	listenToM1();
}

main();

import express, { Response } from 'express';
import { getConnectionAndChannel } from './rmq';
import { M1_QUEUE, M2_QUEUE } from './constants';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

export async function sendToM2(data: unknown) {
	try {
		const { connection, channel } = await getConnectionAndChannel();
		const queue = M2_QUEUE;

		await channel.assertQueue(queue, { durable: false });
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
		console.log('Data sent to M2:', data);

		setTimeout(() => {
			connection.close();
		}, 500);
	} catch (error) {
		console.error('Error sending data to M2:', error);
	}
}

export async function listenToM2(res: Response) {
	try {
		const { connection, channel } = await getConnectionAndChannel();
		const queue = M1_QUEUE;

		await channel.assertQueue(queue, { durable: false });
		channel.consume(
			queue,
			(msg) => {
				if (!msg) return;
				const answer = JSON.parse(msg.content.toString());
				console.log('Answer received from M2:', answer);
				res.json(answer); // Responding to the client with the answer from M2
				connection.close();
			},
			{
				noAck: true,
			}
		);
	} catch (error) {
		console.error('Error listening for answer from M2:', error);
	}
}

app.post('/', (req, res) => {
	const data = req.body;
	sendToM2(data);
	listenToM2(res);
});

app.listen(PORT, () => {
	console.log(`M1 listening on port ${PORT}...`);
});

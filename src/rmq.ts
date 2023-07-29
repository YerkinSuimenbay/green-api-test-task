import amqp from 'amqplib';

export async function getConnectionAndChannel() {
	const url = process.env.RABBITMQ_URL || 'amqp://localhost';
	const connection = await amqp.connect(url);
	const channel = await connection.createChannel();

	return { connection, channel };
}

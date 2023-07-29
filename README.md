# green-api-test-task

## Для того чтобы запустить проект необходимо:
- клонировать проект
- поднять rabbitmq сервер (можно использовать докер команду 'docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management'
- создать .env файл (и заполнить все поля как в .env.example)
- затем запустить эти команды
```bash
npm run build 
npm run start1 
npm run start2
```
  или
```bash
npm run dev1
npm run dev2
```
- сделать '/' пост запрос с телом(JSON) на M1

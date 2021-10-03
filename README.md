Инструкция по запуску
1) git clone 
2) npm install
3) В файле db/sequelizeConnection вводите свой имя/пароль для подключения к postgreSQL базе данных, дамп который вы мне и отправили (test.sql);
4) nodemon app - команда для запуска всего приложения ("/" - страница для поиска занятий с помощью фильтра, "/lessons" - страница для создания занятий)
5) 2 тестовых файла в папке test: findLessonsTest.js, createLessonsTest.js.
  npm flTest - команда для запуска findLessonsTest.js 
  npm clTest - команда для запуска createLessonsTest.js
6)
delete from lesson_teachers where lesson_id > 10;
delete from lessons where id > 10;
ALTER SEQUENCE lessons_id_seq RESTART WITH 11;
SQL команда для сброса данных таблицы к исходному состоянию


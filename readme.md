# Личный проект «Типотека» [![Build status][travis-image]][travis-url]

- Студент: [Илья Сидорчик](https://up.htmlacademy.ru/nodejs/3/user/521287)
- Наставник: [Юрий Кучма](https://htmlacademy.ru/profile/krabaton)

### Как локально развернуть проект

#### 1. Устанавливаем [Docker](https://docs.docker.com/desktop/mac/install/) и [Docker Compose](https://docs.docker.com/compose/install/)

#### 2. Монтируем образ проекта

> Нужно создать файл с приватными данными `.env`. Данные — в Телеграме у @ilyasidorchik

Вводим в консоли команду в корне репозитория:
```
docker-compose up --build -d
```


#### 3. Получаем доступ к базе данных

> В команду вставляем настоящий пароль. Это значение `DB_PASSWORD` в `.env`

```
docker run --name typoteka -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

#### 4. Наполняем базу данных

```
docker exec -it nodejs npm run back-server-cli -- --fill-db 15
```

#### 5. Открываем веб-приложение

Адрес приложения: http://localhost:8080/

*Аккаунт автора блога*
<br/>Эл. почта: `admin@typoteka.ru`<br/>
Пароль: `admin`


> АПИ доступно по адресу: http://localhost:3000/api/articles/1

> Команда для показа логов: `docker-compose logs -f`


---

<a href="https://htmlacademy.ru/intensive/ecmascript"><img align="left" width="50" height="50" title="HTML Academy" src="https://up.htmlacademy.ru/static/img/intensive/ecmascript/logo-for-github.svg"></a>

Репозиторий создан для обучения на интенсивном онлайн‑курсе «[Node.js](https://htmlacademy.ru/intensive/nodejs)» от [HTML Academy](https://htmlacademy.ru).

[travis-image]: https://travis-ci.com/htmlacademy-nodejs/521287-typoteka-3.svg?branch=master
[travis-url]: https://travis-ci.com/htmlacademy-nodejs/521287-typoteka-3

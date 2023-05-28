# alpha backend FastAPI

## Как запустить

1. клонируем репозиторий git clone git@github.com:mrdudov/alpha-backend-fastapi.git
2. переименовать .env_empty в .env
3. выполнить docker-compose up --build
4. (удаляем таблицы и data types в БД)
5. в отдельной консольи выполняем docker-compose exec web alembic upgrade head
6. создаем пользователя по адресу http://localhost:8004/docs#/Users/create_user_users__post
7. на фонте набиваем базу в админ панели

## pgadmin

pgadmin доступен по <http://localhost:5050/>

fastapi доступен по <http://localhost:8004/>

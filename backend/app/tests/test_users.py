import pytest
from jose import jwt
from app.users import schemas as users_schemas
from app import schemas

from app.config import settings


def test_create_user(client):
    user_data = {
        "email": "admin4@mail.com",
        "password": "string",
        "user_role": "ADMINISTRATOR",
        "address": "Admin address"
    }
    url = "/users/create-admin"
    res = client.post(url, json=user_data)
    new_user = users_schemas.UserOut(**res.json())
    assert new_user.email == "admin4@mail.com"
    assert res.status_code == 201


def test_login_user(test_user, client):
    url = "/login"
    user_data = {
        "username": test_user['email'],
        "password": test_user['password']
    }

    res = client.post(url, json=user_data)

    login_res = schemas.Token(**res.json())

    payload = jwt.decode(
        login_res.access_token,
        settings.secret_key,
        algorithms=[settings.algorithm]
    )

    id = payload.get("user_id")
    assert id == test_user['id']
    assert login_res.token_type == "bearer"
    assert res.status_code == 200


def test_user_get_profile(test_user, authorized_client):
    url = "/users/profile"
    res = authorized_client.get(url)
    user_profile = users_schemas.UserProfile(**res.json())

    assert user_profile.address == test_user.get('address')
    assert user_profile.email == test_user.get('email')
    assert user_profile.id == test_user.get('id')
    assert user_profile.user_role == test_user.get('user_role')
    assert res.status_code == 200


def test_user_set_profile(test_user, authorized_client):
    url = "/users/profile"
    profile_data = {
        "address": "new address",
    }

    res = authorized_client.post(url, json=profile_data)
    user_profile = users_schemas.UserProfile(**res.json())

    assert user_profile.address == profile_data.get('address')

    assert user_profile.email == test_user.get('email')
    assert user_profile.id == test_user.get('id')
    assert user_profile.user_role == test_user.get('user_role')

    assert res.status_code == 200


@pytest.mark.parametrize("email, password, status_code", [
    ('wrongemail@gmail.com', 'password123', 403),
    ('sanjeev@gmail.com', 'wrongpassword', 403),
    ('wrongemail@gmail.com', 'wrongpassword', 403),
    (None, 'password123', 422),
    ('sanjeev@gmail.com', None, 422)
])
def test_incorrect_login(test_user, client, email, password, status_code):
    url = "/login"
    user_data = {
        "username": email,
        "password": password,
    }
    res = client.post(url, json=user_data)

    assert res.status_code == status_code

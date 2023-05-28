from app.users.models import User_Role


def is_admin(user):
    if user.user_role == User_Role.ADMINISTRATOR:
        return True
    return False

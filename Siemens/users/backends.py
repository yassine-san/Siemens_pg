from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class CaseInsensitiveModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        usermodel = get_user_model()
        if username is None:
            username = kwargs.get(usermodel.USERNAME_FIELD)

        try:
            case_insensitive_username_field = '{}__iexact'.format(usermodel.USERNAME_FIELD)
            user = usermodel._default_manager.get(**{case_insensitive_username_field : username})

        except usermodel.DoesNotExist:
            usermodel.set_password(password)

        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
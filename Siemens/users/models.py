from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import secrets, string

class AccountManager(BaseUserManager):
    def create_user(self, email, password, partenariat, user_type):
        if not email:
            raise ValueError("email is required")
        if not password:
            raise ValueError("password is required")
        user = self.model(
            email=self.normalize_email(email),
            partenariat=partenariat,
            user_type=user_type
        )
        user.username = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, partenariat, user_type):
        user = self.create_user(
            email,
            password=password,
            partenariat=partenariat,
            user_type=user_type
        )
        user.username = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))
        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Account(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=False)
    date_joined = models.DateTimeField(verbose_name="date joined", auto_now_add=True)
    last_login = models.DateTimeField(verbose_name="last login", auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    # 1 : manager , # 2 : assistant , # 3 : user
    user_type = models.IntegerField(verbose_name='user type',default=3)
    partenariat = models.CharField(verbose_name="partenariat", max_length=100,default=None)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password', 'user_type', 'partenariat']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_staff

    def __is_type(self):
        return self.user_type



from gluon.storage import Storage
from gluon.contrib.appconfig import AppConfig

configuration = AppConfig(reload=True)
settings = Storage()

settings.jwt_secret = configuration.get('jwt.secret')
settings.expiration = configuration.get('jwt.expiration')

import time
import datetime
import json
from gluon.tools import AuthJWT
from gluon.http import HTTP
import gluon.serializers as serializers
from gluon import current


def raisehttpjson(code, message):
    """
    Raise http json response by altering headers.
    """
    body = {"error": message}
    httpres = HTTP(code, json.dumps(body))
    current.response.headers["Content-Type"] = "application/json"
    httpres.headers = current.response.headers
    raise httpres


class CustomJWT(AuthJWT):
    """
    Overwrite existing JWT Class for JSON response
    """
    def serialize_auth_session(self, session_auth):
        """
        As bad as it sounds, as long as this is rarely used (vs using the token)
        this is the faster method, even if we ditch session in jwt_token_manager().
        We (mis)use the heavy default auth mechanism to avoid any further computation,
        while sticking to a somewhat-stable Auth API.
        """
        # TODO: Check the following comment
        # is the following safe or should we use
        # calendar.timegm(datetime.datetime.utcnow().timetuple())
        # result seem to be the same (seconds since epoch, in UTC)
        now = time.mktime(datetime.datetime.now().timetuple())
        expires = now + self.expiration
        payload = dict(
            hmac_key=session_auth['hmac_key'],
            user_groups=session_auth['user_groups'],
            user=session_auth['user'].as_dict(),
            iat=now,
            exp=expires
        )
        return payload

    def load_token(self, token):
        if isinstance(token, unicode):
            token = token.encode('utf-8', 'strict')
        body, sig = token.rsplit('.', 1)
        b64h, b64b = body.split('.', 1)
        if b64h != self.cached_b64h:
            # header not the same
            raisehttpjson(400, u'Invalid JWT Header')
        secret = self.secret_key
        tokend = serializers.loads_json(self.jwt_b64d(b64b))
        if self.salt:
            if callable(self.salt):
                secret = "%s$%s" % (secret, self.salt(tokend))
            else:
                secret = "%s$%s" % (secret, self.salt)
            if isinstance(secret, unicode):
                secret = secret.encode('ascii', 'ignore')
        if not self.verify_signature(body, sig, secret):
            # signature verification failed
            raisehttpjson(401, u'Token signature is invalid')
        if self.verify_expiration:
            now = time.mktime(datetime.datetime.now().timetuple())
            if tokend['exp'] + self.leeway < now:
                raisehttpjson(401, u'Token Expired')
        if callable(self.before_authorization):
            self.before_authorization(tokend)
        return tokend

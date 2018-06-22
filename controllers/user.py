
import json as js
import time
import datetime
from gluon.serializers import json
from gluon.utils import web2py_uuid
from gluon.validators import CRYPT
from gluon.contrib.appconfig import AppConfig

@request.restful()
def login():
    def POST(email,password):
        """
        End Point
        /mobile/authenticate
        Token-Based authentication
        """
        # Set Parameters
        userjson = None
        udict = {}
        udict["token"] = ""
        udict["error"] = "Invalid Credentials"
        myjwt.verify_expiration = True
        now = datetime.datetime.now()
        # Try except is required for passing JSON response
        # rather than standard HTML by catching raised exception
        try:
            token = myjwt.jwt_token_manager()
            token = js.loads(token)['token']
            if token:
                email = request.vars.email
                fields = [db.auth_user.id, db.auth_user.first_name, db.auth_user.last_name]
                user = db(db.auth_user.email == email).select(*fields).first()
                udict = user.as_dict()
                udict['logged_in'] = now.__str__()
                udict['token'] = token
        except Exception, e:
            response.status = 401
        userjson = js.dumps(udict)

        return userjson
    return locals()

@request.restful()
def logout():
    def GET():
        ret = super(Auth,auth).logout()
        #ret = auth.logout()
        return json(ret)
    return locals()
@request.restful()
def verify_email():
    def GET(key=None):
        table_user = auth.table_user()
        user = table_user(registration_key=key)
        if not user:
            return True
        if auth.settings.registration_requires_approval:
            user.update_record(registration_key='pending')
        else:
            user.update_record(registration_key='')
        redirect(htmlurl+'login')
    return locals()



@request.restful()
def request_reset_password():
    def GET(useremail):
        reset_password_key = str(int(time.time())) + '-' + web2py_uuid()
        link = userurl+'reset_password?key='+reset_password_key
        table_user = auth.table_user()

        user = table_user(email=useremail)
        if not user:
            return False
        else:
            d= dict(user)
            d.update(dict(key=reset_password_key ,link=link))
            if not (auth.settings.mailer.send(
                    to=d['email'],
                    subject="Reset Password",
                    message=auth.messages.reset_password % d)):
                return {'user': user, 'msg': 'unable to sent mail'}
            user.update_record(reset_password_key=reset_password_key)
        return json({'user': user, 'msg': 'Reset Password link is send on your email.'});
    return locals()

@request.restful()
def reset_password():
    def GET(key):
        table_user = auth.table_user()
        user = table_user(reset_password_key = key)
        if not user:
            return False
        regkey = user.registration_key
        if regkey in ('pending', 'disabled', 'blocked') or (regkey or '').startswith('pending'):
            return json('registration pending')
        else:
            user.update_record(**{'registration_key': '',
                   'reset_password_key': ''})
            redirect(htmlurl+'reset/'+str(user.id))
    def POST():
        data = js.loads(request.body.read())
        id = data['id']
        password = str(data['password'])
        table_user = auth.table_user()
        user = table_user(id=id)
        password = table_user['password'].validate(password)[0]
        user = user.update_record(password = password)
        return json(user)
    return locals()

@request.restful()
def checkmail():
    def GET(email):
        query = auth.db(auth.db.auth_user.email == email)
        try:
            data = query.select(auth.db.auth_user.email).first()
        except:
            return json(False)
        if data:
            return json(data.email)
        return json(False)
    return locals()


@request.restful()
def register():
    def GET(id):
        table_user = auth.table_user()
        user = table_user(id = id)
        if not user:
            return json(False)
        else:
            return json(user)


    def POST():
        fields = js.loads(request.body.read())
        user = super(Auth, auth).register(**fields)
        key = user['user']['key']

        if True:
            link = userurl+'verify_email?key='+key
            d = user['user']

            d.update(dict(key=key, link=link, username=d['email'],
                          firstname=d['first_name'],
                          lastname=d['last_name']))
            if not (auth.settings.mailer.send(
                    to=d['email'],
                    subject="Verify Email",
                    message=auth.messages.verify_email % d)):
                db.rollback()
                return {'user':user,'msg':'unable to sent mail'}
        return json({'user':user,'msg':'Verification Mail is send on your email.'});

    def PUT(id, **fields):
        if 'password' in fields:
            fields['password'] = CRYPT(auth.settings.hmac_key)(
                                          fields['password'])[0]
        result = db(db.auth_user.id == id).validate_and_update(**fields)
        if 'password' in fields:
            del fields['password']
        return json(result)

    def DELETE(id):
        id = db(db.auth_user.id == id).delete()
        return json(dict(deleted=id))

    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def change_password():
    def POST(id):
        data = js.loads(request.body.read())
        passfield = auth.settings.password_field
        oldpassword = data['old_password']
        newpassword = data['new_password']

        s = db(db.auth_user.id == id)
        requires = db.auth_user[passfield].requires
        if not isinstance(requires, (list, tuple)):
            requires = [requires]
        requires = list(filter(lambda t: isinstance(t, CRYPT), requires))
        if requires:
            requires[0] = CRYPT(**requires[0].__dict__)
            requires[0].min_length = 0
        if not isinstance(requires, (list, tuple)):
            requires = [requires]
        for validator in requires:
            (value, error) = validator(oldpassword)
            if error:
                return json(error)
        oldpassword=value
        current_user = s.select(limitby=(0, 1), orderby_on_limitby=False).first()
        if not oldpassword == current_user[passfield]:
            return json('Invalid Password')
        else:
            d = {passfield: newpassword}
            resp = s.validate_and_update(**d)
            if resp.errors:
                return json(False)
            return json('Password Changed')

    return locals()
import json as js
from gluon.serializers import json
import ast

@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getCompany():
    '''API to get company on id'''
    def GET(id):
        company= db((db.company.id == id)&
                    (db.company.city == db.city.id)&
                    (db.company.state == db.state_or_province.id)).select().first()
        return json(company)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def company_api():
    '''Get all company information associated with user'''
    def GET(id=None):
        if not id:
            company = db(db.company.id).select()
        else:
            company_ids = [u['company'] for u in db(db.company_user.user == id
                                                    ).select()]
            query = (db.company.id.belongs(company_ids))

            company = db((db.state_or_province.id == db.company.state) &
                         (db.city.id == db.company.city))
            company=company(query).select()
        return json(company)

    # def POST(**fields):
    #     metadata = {}
    #     company_table_fields = db.company.fields
    #     table_fields = {}
    #     for field_name in fields:
    #         if field_name not in company_table_fields:
    #             metadata[field_name] = fields[field_name]
    #         else:
    #             table_fields[field_name] = fields[field_name]
    #     table_fields['metadata'] = metadata
    #     company_id = db.company.insert(**table_fields)
    #     table_fields['id'] = company_id
    #     return json(table_fields)
    #
    # def PUT(id, **fields):
    #     company = db.company[id]
    #     metadata = dict()
    #     company_table_fields = db.company.fields
    #     if company and company['metadata']:
    #         try:
    #             metadata = ast.literal_eval(company['metadata'])
    #         except:
    #             pass
    #     table_fields = dict()
    #     for field_name in fields:
    #         if field_name not in company_table_fields:
    #             metadata[field_name] = fields[field_name]
    #         else:
    #             table_fields[field_name] = fields[field_name]
    #     table_fields['metadata'] = metadata
    #     result = db(db.company.id == id).validate_and_update(**table_fields)
    #     return json(result)
    #
    # def DELETE(id):
    #     id = db(db.company.id == id).delete()
    #     return json(dict(deleted=id))

    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def editCompany():
    def GET(id):
        data = db(db.company.id == id).select().first()
        return json(data)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def company_user():
    '''API to get all user of company'''
    def GET(company):
        company_user_ids = [u['user'] for u in db(db.company_user.company == company
                                                  ).select()]
        query = db.auth_user.id.belongs(company_user_ids)
        auth_users = db(query).select(db.auth_user.ALL)
        return json(auth_users)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def createComp():
    '''API to create company'''
    def POST(userid):
        fields = js.loads(request.body.read())
        if fields:
            metadata = {}
            company_table_fields = db.company.fields
            table_fields = {}
            for field in fields:
                for field_name in field:
                    if field_name=='shareholder' or field_name == 'director':
                        pass
                    elif field_name == 'address':
                        address = []
                        for addr in field[field_name]:
                            addr=str(addr)
                            if addr == 'city':
                                table_fields[addr] = int(field[field_name][addr])
                            elif addr == 'state':
                                table_fields[addr] = int(field[field_name][addr])
                            elif addr == 'country':
                                table_fields[addr] = int(field[field_name][addr])
                            else:
                                if field[field_name][addr] != None:
                                    address.append(field[field_name][addr])

                        table_fields[field_name] = ','.join(address[::-1])
                    elif str(field_name) not in company_table_fields:
                        metadata[field_name] = field[field_name]

                    else:
                        table_fields[field_name] = field[field_name]
            table_fields['metadata'] = metadata
            company_id = db.company.insert(**table_fields)
            userFields = {'user': userid, 'company': company_id, 'primary_account': True}
            db.company_user.insert(**userFields)
            table_fields['id'] = company_id
            return json(company_id)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def updateComp():
    '''Update company data'''
    def POST(companyid):
        fields = js.loads(request.body.read())
        if fields:
            metadata = {}
            company_table_fields = db.company.fields
            table_fields = {}
            for field in fields:
                if field=='shareholder' or field == 'director':
                    pass
                elif field == 'address':
                    address = []
                    for addr in fields[field]:
                        addr=str(addr)
                        if addr == 'city':
                            table_fields[addr] = int(fields[field][addr])
                        elif addr == 'state':
                            table_fields[addr] = int(fields[field][addr])
                        elif addr == 'country':
                            table_fields[addr] = int(fields[field][addr])
                        else:
                            if fields[field][addr] != None:
                                address.append(fields[field][addr])

                    table_fields[field] = ','.join(address[::-1])
                elif str(field) not in company_table_fields:
                    metadata[field] = fields[field]

                else:
                    table_fields[field] = fields[field]
            table_fields['metadata'] = metadata
            company_id = db(db.company.id == companyid).update(**table_fields)
            return json(company_id)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def company_stakeholder():
    '''API to get and create company stakeholders'''
    def GET(company, role):
        company_user_ids = [u['user'] for u in db((db.company_stakeholder.company == company) & (db.company_stakeholder.role == role)
                                                  ).select()]
        query = db.stakeholder.id.belongs(company_user_ids)
        stakeholders = db(query).select()
        return json(stakeholders)

    def POST(company):
        data = js.loads(request.body.read())
        table_fields = db.stakeholder.fields
        for field in data:
            for field_name in field:
                if field_name in ['director', 'shareholder']:
                    role = field_name
                    for f in field[field_name]:
                        fields = {}
                        for fi in f:
                            if fi == 'name':
                                try:
                                    names = f[fi].split()
                                    fields['first_name'] = names[0]
                                    fields['last_name'] = names[1]
                                except:
                                    fields['first_name'] = names[0]
                            elif fi == 'address':
                                address = []
                                for addr in f[fi]:
                                    addr = str(addr)
                                    if addr == 'city':
                                        fields[addr] = int(f[fi][addr])
                                    elif addr == 'state':
                                        fields[addr] = int(f[fi][addr])
                                    elif addr == 'country':
                                        fields[addr] = int(f[fi][addr])
                                    else:
                                        if f[fi][addr] != None:
                                            address.append(f[fi][addr])

                                fields[fi] = ','.join(address[::-1])
                            elif fi in table_fields:
                                fields[fi] = f[fi]
                        id = db.stakeholder.validate_and_insert(**fields)
                        db.commit()
                        compstkh = {'user':id,'company':company,'role':role}
                        id1 = db.company_stakeholder.insert(**compstkh)
        return json(id1)

    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def updatestakeholder():
    '''Update stakeholders data'''
    def POST():
        data = js.loads(request.body.read())
        table_fields = db.stakeholder.fields
        for field in data:
            if field in ['director', 'shareholder']:
                role = field
                for f in data[field]:
                    fields = {}
                    for fi in f:
                        if fi == 'name':
                            try:
                                names = f[fi].split()
                                fields['first_name'] = names[0]
                                fields['last_name'] = names[1]
                            except:
                                fields['first_name'] = names[0]
                        elif fi == 'address':
                            address = []
                            for addr in f[fi]:
                                addr = str(addr)
                                if addr == 'city':
                                    fields[addr] = int(f[fi][addr])
                                elif addr == 'state':
                                    fields[addr] = int(f[fi][addr])
                                elif addr == 'country':
                                    fields[addr] = int(f[fi][addr])
                                else:
                                    if f[fi][addr] != None:
                                        address.append(f[fi][addr])
                            fields[fi] = ','.join(address[::-1])
                        elif fi in table_fields:
                            fields[fi] = f[fi]
                    id = db(db.stakeholder.id == f['id']).validate_and_update(**fields)
        return json(id)

    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getCity():
    '''Get list of cities based on state'''
    def GET(stateId=None):
        if stateId:
            city = db(db.city.state_or_province == stateId).select()
        else:
            city = db(db.city).select()
        return json(city)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getState():
    '''Get list of states based on country'''
    def GET(countryId=None):
        try:
            if countryId:
                states = db(db.state_or_province.country == countryId).select()
            else:
                states = db(db.state_or_province).select()
            return json(states)
        except:
            states = db(db.state_or_province.country == 101).select()
            return json(states)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getCountry():
    '''Return list of all countries'''
    def GET(*args, **vars):
        patterns = 'auto'
        parser = db.parse_as_rest(patterns, args, vars)
        if parser.status ==200:
            return json(parser.response)
        else:
            raise HTTP(parser.status, parser.error)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def uploader():
    '''API to upload company files'''
    def POST(**files):
        for k, filed in files.iteritems():
            for file in filed:
                filename = db.company_doc.doc.store(file, file.filename)
                id = db.company_doc.validate_and_insert(act_doc=None, activity=None, doc=filename)
        return json('files uploaded')
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getProcess():
    '''API to get all process list'''
    def GET():
        process = db(db.process.id > 2).select()
        return json(process)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def nationality():
    '''Get list of all nationalities'''
    def GET():
        data = db(db.nationality).select()
        return json(data)
    return locals()
from gluon.serializers import json
from gluon.contrib import simplejson
import json as js

response.headers["Access-Control-Allow-Origin"] = '*'
response.headers['Access-Control-Max-Age'] = 86400
response.headers['Access-Control-Allow-Headers'] = '*'
response.headers['Access-Control-Allow-Methods'] = '*'
response.headers['Access-Control-Allow-Credentials'] = 'true'

@request.restful()
def createComp():
    def POST():
        fields = simplejson.loads(request.body.read())
        '''elif isinstance(field[field_name], dict):
                                fieldName=""
                                for k, v in field[field_name].iteritems():
                                    fieldName+=v
                                field[field_name]=fieldName

                                table_fields[field_name] = field[field_name]'''
        if fields:
            metadata = {}
            company_table_fields = db.company.fields
            table_fields = {}
            for field in fields:
                for field_name in field:
                    field_name = field_name.encode('ascii', 'ignore')
                    if field_name not in company_table_fields:
                        metadata[field_name] = field[field_name]

                    else:
                        table_fields[field_name] = field[field_name]
            table_fields['metadata'] = metadata
            company_id = db.company.insert(**table_fields)
            table_fields['id'] = company_id
            return json(table_fields)
    return locals()
#Resolution tables

db.define_table('resolution_type',
                Field('name',length=100),
                Field('description',length=250),
                format='%(name)s'
                )

db.resolution_type.name.requires = IS_NOT_EMPTY(error_message=auth.messages.is_empty)
db.resolution_type.description.requires = IS_NOT_EMPTY(error_message=auth.messages.is_empty)

db.define_table('resolution',
                Field('name',length=100),
                Field('description',length=250),
                Field('type',db.resolution_type),
                format='%(name)s'
                )

db.resolution.name.requires = IS_NOT_EMPTY(error_message=auth.messages.is_empty)
db.resolution.description.requires = IS_NOT_EMPTY(error_message=auth.messages.is_empty)


db.define_table('activity_group',
                Field('name',length=100),
                Field('description',length=250),
                Field('config','json'),
                format='%(name)s')

db.define_table('activity_type',
                Field('name',length=50),
                Field('description',length=250),
                format='%(name)s')

db.define_table('activity',
                Field('name',length=100),
                Field('description',length=250),
                Field('group',db.activity_group),
                Field('type',db.activity_type),
                format='%(name)s')

db.define_table('activity_item',
                Field('name',length=100),
                Field('description',lenght=250),
                Field('activity',db.activity),
                format='%(name)s')


db.define_table('doc_type',
                Field('name',length=100),
                Field('description',length=250),
                format='%(name)s')

db.define_table('doc',
                Field('name',length=100),
                Field('description', length=250),
                Field('type',db.doc_type),
                Field('doc','upload'),
                format='%(name)s')

db.define_table('activity_doc',
                Field('activity',db.activity),
                Field('activity_item',db.activity_item),
                Field('doc',db.doc)
                )
db.define_table('countries',
                Field('name', length=50),
                format = '%(name)s')
db.define_table('nationality',
                Field('name',length=100))

db.define_table('state_or_province',
                Field('name',length=100),
                Field('country',db.countries),
                format='%(name)s')

db.define_table('city',
                Field('name',length=100),
                Field('state_or_province',db.state_or_province),
                format='%(name)s')




# Workflow Engine Tables


db.define_table('process',
                Field('name', length=100),
                Field('description', length=250),
                Field('type', length=50),
                format='%(name)s')

db.define_table('process_activity',
                Field('process', db.process),
                Field('activity', db.activity),
                Field('default_next', db.activity),
                Field('alt_next', db.activity),
                Field('alt_next_process', db.process),
                Field('first_activity', 'boolean'),
                Field('last_activity', 'boolean'),
                Field('status',length=100),
                Field('config','json'),
                Field('remark','text'),
                format='%(activity)s')

db.define_table('process_activity_item',
                Field('name', length=100),
                Field('activity_item', db.activity_item),
                Field('status', length=50),
                format='%(name)s'
                )


#Comtany Data

db.define_table("company",
                Field('name',length=100),
                Field('description', label=T('Description'),length=100),
                Field('cin',length=50),
                Field('date_of_inc','date'),
                Field('country',db.countries),
                Field('state', db.state_or_province),
                Field('city',db.city),
                Field('paid_up_capital','bigint'),
                Field('authorised_capital','bigint'),
                Field('email',length=100),
                Field('phone', length=11),
                Field('address', 'string'),
                Field('status',length=20),
                Field('metadata','json',label=T('Metadata')),
                format='%(name)s')

db.define_table("user_details",
                Field('user', db.auth_user),
                Field('number', label=T('Number'), length=11),
                Field('dob','date', label=T('date')),
                Field('address','text',label=T('address')),
                Field('country', length=50,label=T('country')),
                Field('state', db.state_or_province),
                Field('city', db.city)
                )

db.define_table("company_user",
                Field('user', db.auth_user),
                Field('company',db.company),
                Field('primary_account', 'boolean')
                )

db.define_table('stakeholder',
                Field('first_name',length=50),
                Field('last_name',length=50),
                Field('email',length=100),
                Field('address','string'),
                Field('date_of_birth','date'),
                Field('fathers_name',length=50),
                Field('mothers_name',length=50),
                Field('qualification',length=50),
                Field('nationality',length=50),
                Field('contact_number', length=11),
                Field('DIN',length=50),
                Field('country', length=50,label=T('country')),
                Field('state', db.state_or_province),
                Field('city', db.city),
                format='%(first_name)s %(last_name)s'
                )

db.define_table('board_meeting',
                Field('approved_by_director', db.stakeholder),
                Field('agenda', 'json'),
                Field('process',db.process),
                Field('event','integer'),
                Field('place',length=100),
                Field('address','string'),
                Field('bm_date', 'datetime',requires=IS_DATETIME(format='%Y-%m-%d %I:%M %p')),
                Field('notice_date','date'),
                Field('serial', length=100),
                Field('company',db.company),
                Field('status',length=50),
                Field('description','text'),
                Field('meeting_type',length=100),
                Field('steps',length=50),
                Field('agenda_doc','upload'),
                Field('attendance','upload'),
                Field('minutes_of_meeting','upload'),
                Field('resolution','json'),
                Field('director_present','json'),
                Field('director_absent','json'),
                Field('member_present','json'),
                Field('member_absent','json'),
                format = '%(serial)s')

db.define_table("company_process",
                Field('process',db.process),
                Field('company',db.company),
                Field('parent_process', 'reference company_process'),
                Field('status',length=50),
                Field('board_meeting',db.board_meeting),
                Field('egm',db.board_meeting),
                Field('agm',db.board_meeting),
                Field('steps','integer'),
                Field('filling_document','json'),
                auth.signature,
                format='%(process)s')


db.define_table('company_stakeholder',
                Field('user',db.stakeholder),
                Field('company', db.company),
                Field('role', length=100))


db.define_table('company_activity',
                Field('process', db.company_process),
                Field('activity', db.process_activity),
                Field('activity_item', db.process_activity_item, unique=True),
                Field('status', 'string'),
                Field('end_date', 'date'),
                Field('config', 'text'),
                auth.signature,
                format='%(activity)s')


db.define_table('company_doc',
                Field('act_doc', db.doc),
                Field('activity', db.company_activity),
                Field('doc', 'upload'))

#FAQS

db.define_table('faq_category',
                Field('name', length=250),
                Field('description', 'text', default=''),
                format='%(name)s')

db.define_table('faq',
                Field('question', 'string'),
                Field('answer', 'text', default=''),
                Field('category', db.faq_category))

db.define_table('create_company',
                Field('client_name', 'string'),
                Field('address', 'string'),
                Field('phone', 'string'),
                Field('email','string'))

db.define_table('agenda_table',
                Field('short_agenda','string'),
                Field('long_agenda','text'),
                Field('BR','text'),
                Field('OR','text'),
                Field('SR','text'),
                Field('process',db.process),
                format = '%(short_agenda)s%'
                )

auth.enable_record_versioning(db)

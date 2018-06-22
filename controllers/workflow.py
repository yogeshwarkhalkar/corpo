import datetime
import json as js
import os
import time

from docxtpl import DocxTemplate, RichText

from gluon.serializers import json


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getCompanyProcess():
    '''API to get specific company process by process id'''
    def GET(company,process):
        data = db((db.company_process.process==process)&
                 (db.company_process.company==company)).select()
        return json(data)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def company_process():
    '''API for selecting all company process based on id or get all company process based on company in reverse order'''
    def GET(company_id,id=None):
        process_id = [company['process'] for company in db(db.company_process.company == company_id).select()]
        query = db(db.process.id.belongs(process_id)&
                   (db.company.id == company_id))
        if id:
            process =query(db.process.id==id).select()
        else:
            process = query.select(orderby=~db.process.id)
        return json(process)

    def POST(table_name, **fields):
        return db[table_name].validate_and_insert(**fields)
    def PUT(id, **fields):
        result = db(db.process_activity.id == id).validate_and_update(**fields)
        return json(result)

    def DELETE(id):
        id = db(db.process_activity.id == id).delete()
        return json(dict(deleted=id))
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getDirector():
    '''API to get all director of company'''
    def GET(companyId):
        user_ids = [u['user'] for u in db((db.company_stakeholder.company==companyId)&
                                          (db.company_stakeholder.role == 'director')).select()]
        query = db.stakeholder.id.belongs(user_ids)

        subscriber = db(query).select()
        return json(subscriber)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getShareholder():
    '''API to get all shareholder of company'''
    def GET(companyId):
        user_ids = [u['user'] for u in db((db.company_stakeholder.company==companyId)&
                                          (db.company_stakeholder.role == 'shareholder')).select()]
        query = db.stakeholder.id.belongs(user_ids)

        subscriber = db(query).select()
        return json(subscriber)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getStakeholder():
    '''API to get all stakeholders of company'''
    def GET(companyId):
        user_ids = [u['user'] for u in db((db.company_stakeholder.company==companyId)).select()]
        query = db.stakeholder.id.belongs(user_ids)

        subscriber = db(query).select()
        return json(subscriber)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getFirstActivity():
    '''API to get first activity of company'''
    def GET(process):
        activity = db((db.process_activity.process == process)&
                      (db.process_activity.first_activity == True)).select(db.process_activity.activity).first()
        return json(activity)
    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getallactivity():
    '''API to get all activity of process and insert to company activity'''
    def GET(process,companyProcess):
        allActivity = db((db.process_activity.process == process)).select()
        for act in allActivity:
            oldact = db((db.company_activity.process == companyProcess)&
                        (db.company_activity.activity == act['activity'])).select()
            if not oldact:
                field={'process':companyProcess,'activity':act['activity'],'activity_item':None,'status':'Incomplete','config':None}
                ret = db.company_activity.insert(**field)
                db.commit()

        return json(allActivity)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getActivity():
    '''API to get activity based on process and activity id and POST to save completed activity'''
    def GET(processId, activityId=None):
        try:
            if not activityId:
                activity = db((db.process_activity.process == processId) &
                              (db.process_activity.first_activity == True)).select(db.process_activity.activity).first()
                return json(activity)

            if activityId != '1':
                    activity = db((db.process_activity.process == processId) &
                                  (db.process_activity.activity == activityId) &
                                  (db.process.id == processId) &
                                  (db.activity.id == activityId)).select().first()
                    activity1 = db((db.activity.group == activity['activity']['group']) &
                                      (db.activity_group.id == activity['activity']['group'])&
                                   (db.process.id == processId) &
                                   (db.process_activity.activity == activityId) &
                                   (db.activity.id == activityId)).select().first()
            else:
                activityId = db((db.process_activity.process == processId)&
                                (db.process_activity.first_activity == True)).select(db.process_activity.activity).first()
                activity = db((db.process_activity.process == processId) &
                              (db.process_activity.activity == activityId['activity']) &
                              (db.process.id == processId)&
                              (db.activity.id == activityId['activity'])).select().first()
                activity1 = db((db.activity.group == activity['activity']['group'])&
                              (db.activity_group.id == activity['activity']['group'])&
                               (db.process.id == processId)&
                               (db.process_activity.activity == activityId['activity']) &
                              (db.activity.id == activityId['activity'])).select().first()
        except :
            return (HTTP(404, 'page not found'))
        return json(activity1)

    def POST(processId, activityId,next):
        nextOpt = ['Yes','yes','True','true']
        if processId:
            if next in nextOpt:
                act = db((db.process_activity.activity == activityId) &
                         (db.process_activity.process == processId)
                         ).select(db.process_activity.default_next).first()
                data = {'next':act['default_next'], 'next_process':False}
                return json(data)
            else:
                act = db((db.process_activity.activity == activityId) &
                     (db.process_activity.process == processId)
                     ).select(db.process_activity.alt_next).first()
                if act['alt_next']:
                    data = {'next': act['alt_next'],'next_process':False}
                    return json(data)
                else:
                    act = db((db.process_activity.activity == activityId) &
                             (db.process_activity.process == processId)
                             ).select(db.process_activity.alt_next_process).first()
                    data = {'next': act['alt_next_process'],'next_process':True}
                    return json(data)
        return json(False)

    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def storeProcessActivity():
    def GET(eventId, activityId):
        fields = {'status': 'Ongoing'}
        status = db((db.company_activity.process == eventId) &
                        (db.company_activity.activity == activityId)).select().first()
        if status:
            if status['status'] == 'Incomplete':
                processAct = db((db.company_activity.process == eventId) &
                        (db.company_activity.activity == activityId)).update(**fields)
                return json(processAct)
        return json(False)

    def POST(eventId, activityId):
        data = js.loads(request.body.read())
        fields = {'status': 'Complete','config': data['config']}
        processAct = db((db.company_activity.process == eventId)&
                        (db.company_activity.activity == activityId)).update(**fields)
        return json(processAct)

    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def sendShortNotice():
    '''API to send shorter notice to shareholder and directors'''
    def POST(id = None):
        data = js.loads(request.body.read())
        company = data['company']
        meetingType = data['meeting']
        meetingDate = str(data['bm_date'])
        address = data['address']
        meetingDate = int(meetingDate[:-3])
        mdate = time.strftime("%A,%B %d %Y,%H:%M %p", time.localtime(meetingDate))
        meetingDate = mdate.split(',')
        day = meetingDate[0]
        mdate = meetingDate[1]
        mtime = meetingDate[2]
        if id:
            stk = db(db.stakeholder.id == id).select(db.stakeholder.email, db.stakeholder.first_name).first()
            email = stk['email']
        else:
            email = data['email']

        if meetingType == 'BM':
            filename = 'BM Shorter Consent-' + stk['first_name'] + '.docx'
            subject = "Board Meeting consent on Behalf of " + company
            files = [mail.Attachment(filename, content_id='document')]
            message = "Dear Sirs,\n\n" \
                      "A Board Meeting is scheduled to be held at a shorter notice on "+ mdate+" at "+mtime+". at the "+address+\
                      " of the Company. The notice and the agenda for the said meeting is attached herewith for your kind perusal.\n\n" \
                      "Request you to kindly give your approval for holding the meeting at Shorter Notice. You may kindly give your" \
                      " approval by replying on this email."
        elif meetingType == 'EGM':
            to = data['to']
            director = data['directorName']
            if to == 'individual':
                shareholder = data['shareholder']
                print shareholder
                filename = str("Individual_Shorter notice consent - EGM - " + shareholder + ".docx")
                files = [mail.Attachment(filename, content_id='document')]
            elif to == 'bodycorporate':
                files = [mail.Attachment("Body Corporate _Shorter Consent - EGM.docx", content_id='document')]
                files += [mail.Attachment("Body Corporate-Authorisation Form for attending EGM.docx", content_id='document')]
            subject = "EGM consent on Behalf of " + company
            message = "Dear Member,\n\n" \
                      "We are pleased to inform that the Extra-ordinary  General Meeting ('EGM') of "+company+\
                      " ('Company'), is scheduled to be held on "+mdate+" at "+mtime+" at "+address+" of the Company at shorter notice.\n\n" \
                      "Please find attached the notice calling the EGM  for your perusal.\n\n" \
                      "You are requested to share your consents for holding the EGM at shorter notice in the attached letter and make it convenient" \
                      " to attend the meeting.\n\n" \
                      "Best Regards\n"+director+"\nOn behalf of the Board of Directors\n"+company
        else:
            stakeholder = data['stakeholder']
            print stakeholder
            filename = str("Shorter notice consent - AGM - " + stakeholder + ".docx")
            files = [mail.Attachment(filename, content_id='document')]
            subject = "AGM consent on Behalf of " + company

            message = "Dear Sir/ Madame, \n\n \
                        We are pleased to inform that the Annual General Meeting ('AGM') of('Company'), is \n \
                        scheduled to be held on ," + mdate + " at " + mtime + ", at the " + address + ". \n\n \
                        Please find attached the notice and agenda for your perusal. \n\n \
                        Please make it convenient to attend the AGM. \n\n \
                        Best Regards \n\n \
                        On behalf of the Board of Directors\n \
                        " + company

        if not (auth.settings.mailer.send(
                to=email,
                subject=subject,
                message=message,
                attachments=files)):
            return {'msg': 'unable to sent mail'}
        return json(True)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def sendToStakeholder():
    '''API to send agenda/Notice ti shareholder, director etc.'''
    def POST(id=None):
        data = js.loads(request.body.read())
        file = data['file']
        serial = data['serial']
        agendaType = data['agendaType']
        company = data['company']
        director = data['directorName']
        meetingDate = str(data['meetingDate'])
        address = data['address']
        meetingDate = int(meetingDate[:-3])
        mdate = time.strftime("%A,%B %d %Y,%H:%M %p", time.localtime(meetingDate))
        meetingDate = mdate.split(',')
        day = meetingDate[0]
        mdate = meetingDate[1]
        mtime = meetingDate[2]
        pa = os.path.join(request.folder, 'uploads', file)
        if not id:
            email = data['email']
        else:
            stk = db(db.stakeholder.id == id).select(db.stakeholder.email).first()
            email = stk['email']
        if agendaType == 'BM':
            subject = "Board Meeting for - "+serial+" on Behalf of "+company
            message = "Dear Sir/ Madame, \n\n \
                We are pleased to inform that the " +serial+ " meeting of the board of directors of " +company+  " ('Company'), is \n \
                scheduled to be held on ,"+mdate+" at "+mtime+", at the "+address+". \n\n \
                Please find attached the notice and agenda for your perusal. \n\n \
                Please make it convenient to attend the meeting. \n\n \
                Best Regards \n\n \
                On behalf of the Board of Directors\n \
                "+company+" \n\n \
                "+director
        if agendaType == 'EGM':
            subject = "Extra-ordinary General Meeting for - "+serial+" on Behalf of "+company
            message = "Dear Sir/ Madame, \n\n \
            We are pleased to inform that the Extra-ordinary General Meeting ('EGM') of('Company'), is \n \
            scheduled to be held on ,"+mdate+" at "+mtime+", at the "+address+". \n\n \
            Please find attached the notice and agenda for your perusal. \n\n \
            Please make it convenient to attend the EGM. \n\n \
            Best Regards \n\n \
            On behalf of the Board of Directors\n \
            "+company+" \n\n \
            "+director
        if agendaType == 'AGM':
            subject = "Annual General Meeting for - "+serial+" on Behalf of "+company
            message = "Dear Sir/ Madame, \n\n \
            We are pleased to inform that the Annual General Meeting ('AGM') of('Company'), is \n \
            scheduled to be held on ,"+mdate+" at "+mtime+", at the "+address+". \n\n \
            Please find attached the notice and agenda for your perusal. \n\n \
            Please make it convenient to attend the AGM. \n\n \
            Best Regards \n\n \
            On behalf of the Board of Directors\n \
            "+company+" \n\n \
            "+director

        if not (auth.settings.mailer.send(
                    to=email,
                    subject=subject,
                    message=message,
                    attachments=mail.Attachment(str(pa), content_id='document'))):
            return {'msg': 'unable to sent mail'}
        return json(True)
    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def workflowSteps():
    '''APi to get all activity of process'''
    def GET(processId):
        completeActivity = db((db.company_activity.process == processId)&
                              (db.company_activity.activity == db.activity.id))\
            .select(db.activity.id,db.activity.name, db.company_activity.status)
        return json(completeActivity)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def activity_status():
    '''API to get activity status'''
    def GET(activity_id):
        activity = db(db.company_activity.id == activity_id
                      ).select(db.company_activity.id,
                               db.company_activity.status)
        return json(activity)

    def POST():
        data = js.loads(request.body.read())
        activity_id=str(data['activity_id'])
        status=str(data['status'])
        result = db(db.company_activity.activity == activity_id).validate_and_update(status=status)
        return json(result)

    def PUT(id, **fields):
        status="completed"
        result = db(db.company_activity.activity == id).validate_and_update(status=status)
        return json(result)
    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def processStatus():
    '''API to update process status'''
    def GET(id):
        process = db(db.company_process.id == id).validate_and_update(status = 'close')
        return json(process)
    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def uploader():
    '''API to upload files to company_doc'''
    def POST(eventId, activityId,**files):
        processAct = db((db.company_activity.process == eventId) &
                        (db.company_activity.activity == activityId)).select(db.company_activity.id).first()
        for k, filed in files.iteritems():
            if not isinstance(filed,list):
                filename = db.company_doc.doc.store(filed, filed.filename)
                id = db.company_doc.validate_and_insert(act_doc=1, activity=processAct.id, doc=filename)
            else:
                for file in filed:
                    filename = db.company_doc.doc.store(file, file.filename)
                    id = db.company_doc.insert(act_doc=1, activity=processAct.id, doc=filename)
        return json(id)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def download():
    '''API to download doc table files'''
    def POST():
        fileId = js.loads(request.body.read())
        fileName = db(db.doc.id == fileId).select(db.doc.doc).first()
        org_file_name, file_stream = db.doc.doc.retrieve(fileName['doc'])
        file_header = "attachment; filename=" + org_file_name
        response.headers['ContentType'] = "application/octet-stream"
        response.headers['Content-Disposition'] = file_header
        return response.stream(file_stream)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def storeMeeting():
    '''API to store meeting(BM, EGM, AGM)'''
    def GET(company_id,status, meeting_id=None):
        fields = [db.board_meeting.id, db.board_meeting.serial, db.board_meeting.bm_date, db.board_meeting.status,
                  db.board_meeting.attendance, db.board_meeting.agenda_doc, db.board_meeting.resolution,
                  db.board_meeting.meeting_type,
                  db.board_meeting.minutes_of_meeting, db.board_meeting.notice_date, db.board_meeting.description]
        if status == 'all':
            bm = db((db.board_meeting.company == company_id)).select(*fields)
            return json(bm)
        if meeting_id:
            bm = db((db.board_meeting.id == meeting_id)).select(*fields)
        else:
            bm = db((db.board_meeting.company == company_id)&
                (db.board_meeting.status == status)).select(*fields)
        return json(bm)
    def POST():
        data = js.loads(request.body.read())
        table_fields = {}
        agenda = {}
        for field in data:
            if field != 'agenda':
                table_fields[field] = data[field]
            else:
                for i, val in enumerate(data['agenda']):
                    agenda['agenda' + str(i + 1)] = val
                table_fields[field] = agenda
        id = db.board_meeting.insert(**table_fields)
        db.commit()
        serial = db(db.board_meeting.id == id).select(db.board_meeting.serial).first()
        data = {'id': id, 'serial': serial['serial']}
        return json(data)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def storeEvent():
    '''API to get all process list'''
    def GET(company_id,status):
        if status == 'all':
            event = db((db.company_process.company == company_id) &
                       (db.company_process.process == db.process.id) &
                       (db.company_process.process != 2)).select()
        else:
            event = db((db.company_process.company == company_id)&
                (db.company_process.status == status)&
                   (db.company_process.process == db.process.id)&
                   (db.company_process.process != 2)).select()

        return json(event)

    def POST():
        data = js.loads(request.body.read())
        table_fields = {}
        document={}
        for field in data:
            if field == 'filling_document':
                for i,val in enumerate(data[field]):
                    document['doc'+str(i+1)] = val
                table_fields[field] = document
            else:
                table_fields[field] = data[field]

        id = db.company_process.insert(**table_fields)
        data = {'id':id}
        return json(data)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def updateEvent():
    '''API to update and get event'''
    def GET(id):
        fields=[db.company_process.process,db.company_process.steps,db.company_process.board_meeting,
                db.company_process.egm,db.company_process.agm]
        data = db(db.company_process.id == id).select(*fields).first()
        return json(data)
    def POST(id):
        data = js.loads(request.body.read())
        table_fields = {}
        document = {}
        for field in data:
            if field == 'filling_document':
                for i, val in enumerate(data[field]):
                    document['doc' + str(i + 1)] = val
                table_fields[field] = document
            else:
                table_fields[field] = data[field]
        ids = db(db.company_process.id == id).update(**table_fields)
        return json(ids)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def uploadFilling():
    '''API to get and upload filling documents'''
    def GET(filename):
        file, file_stream = db.company_process.filling_document.retrieve(filename)
        response.headers['Content-Disposition'] = '{0}'.format(file)
        return response.stream(file_stream)
    def POST(id,name,**doc):
        tablefields={}
        filesupload={}
        field={}
        count = 1
        filling = db(db.company_process.id ==id).select(db.company_process.filling_document).first()
        for key,files in doc.iteritems():
            if isinstance(files,list):
                for i, file in enumerate(files):
                    filename = db.company_process.filling_document.store(file, file.filename)
                    filesupload[key+str(i+1)] = filename
            else:
                filename = db.company_process.filling_document.store(files, files.filename)
                filesupload['file'] =filename
        if filling['filling_document']:
            for i, r in enumerate(filling['filling_document']):
                field[r]=filling['filling_document'][r]
                count+=1
            field[name] = filesupload

            tablefields['filling_document'] = field
        else:
            field[name]=filesupload
            tablefields['filling_document'] = field
        ids = db(db.company_process.id == id).update(**tablefields)
        return json(ids)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def updateNotice():
    '''API to update meeting'''
    def POST(id):
        vars = js.loads(request.body.read())
        tableFields = {}
        agenda={}
        for field in vars:
            if field == 'agenda':
                for i, val in enumerate(vars['agenda']):
                    agenda['agenda' + str(i + 1)] = val
                tableFields[field] = agenda
            elif field == 'serial':
                pass
            elif field == 'director_present' or field == 'director_absent':
                director = {}
                for i,f in enumerate(vars[field]):
                    director['director'+str(i+1)] = f
                tableFields[field]=director
            elif field == 'member_present' or field == 'member_absent':
                member = {}
                for i,f in enumerate(vars[field]):
                    member['member'+str(i+1)] = f
                tableFields[field]=member
            else:
                tableFields[field] = vars[field]
        id = db(db.board_meeting.id == id).update(**tableFields)
        return json(id)
    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def meetingCount():
    '''API to get meeting count for close and open meeting'''
    def GET(id):
        company_ids = [u['company'] for u in db(db.company_user.user == id
                                                ).select()]
        query = db.board_meeting.company.belongs(company_ids)
        counts=[]
        for i in company_ids:
            company = db((db.board_meeting.company == i)&(db.board_meeting.status=='open'))
            open = company(query).select()
            company = db((db.board_meeting.company == i) & (db.board_meeting.status == 'close'))
            close = company(query).select()
            counts.append({'company':i,'open':len(open),'close':len(close)})

        return json(counts)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def eventCount():
    '''API to get event count of close and open event'''
    def GET(id):
        company_ids = [u['company'] for u in db(db.company_user.user == id
                                                ).select()]
        query = db.company_process.company.belongs(company_ids)
        counts=[]
        for i in company_ids:
            company = db((db.company_process.company == i)&(db.company_process.status=='open')&
                         (db.company_process.process != 2))
            open = company(query).select()
            company = db((db.company_process.company == i) & (db.company_process.status == 'close')&
                         (db.company_process.process != 2))
            close = company(query).select()
            counts.append({'company':i,'open':len(open),'close':len(close)})

        return json(counts)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def updateAgenda():
    def GET(serial,company):
        agenda = db((db.board_meeting.serial == serial)&
                    (db.board_meeting.company == company)).select(db.board_meeting.agenda).first()
        return json(agenda['agenda'])

    def POST():
        data = js.loads(request.body.read())
        serial = data['bm']
        newAgenda = data['agenda']
        company = data['company']
        agenda={}
        tableField={}
        oldAgenda = db((db.board_meeting.serial == serial) &
                    (db.board_meeting.company == company)).select(db.board_meeting.agenda).first()
        ret = oldAgenda['agenda']
        for r in ret:
            if ret[r] not in newAgenda:
                newAgenda.append(ret[r])
        for i,a in enumerate(newAgenda):
            agenda['agenda'+str(i+1)] = a
        tableField['agenda']=agenda
        db(db.board_meeting.serial == serial).update(**tableField)
        db.commit()

        returnAgenda = db((db.board_meeting.serial == serial) &
                    (db.board_meeting.company == company)).select().first()

        return json(returnAgenda)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getAgenda():
    def GET(id=None):
        if id:
            agenda = db(db.agenda_table.process == id).select()
            return json(agenda)
        else:
            agenda = db(db.agenda_table).select()
            return json(agenda)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getMeeting():
    def GET(id):
        agenda = db((db.board_meeting.id == id)&
                    (db.board_meeting.company == db.company.id)).select().first()
        return json(agenda)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getResolution():
    def POST():
        data = js.loads(request.body.read())
        resolution=[]
        for i, agenda in enumerate(data):
            res = db(db.agenda_table.short_agenda == agenda).select().first()
            resolution.append(res)
        return json(resolution)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def boardMeeting():
    def GET(company,meeting=None):
        if meeting:
            now = datetime.datetime.now()
            ids = [[meeting['serial'], meeting['id']] for meeting in db((db.board_meeting.company == company) &
                                                                        (db.board_meeting.meeting_type == meeting)
                                                                        ).select()]
            return json(ids)
        else:
            ids = [[meeting['serial'],meeting['id']] for meeting in db(db.board_meeting.company == company).select()]
        return json(ids)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getMeetingSerial():
    '''API to get serial number of all meeting of company'''
    def GET(company):
        ids = [meeting['serial'] for meeting in db((db.board_meeting.company == company)).select()]
        return json(ids)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def meetingStatus():
    def GET(id):
        tablefield={}
        tablefield['status']='close'
        data = db(db.board_meeting.id == id).update(**tablefield)
        return json(data)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def generateAVM():
    '''API to generate AVM document'''
    def POST():
        data = js.loads(request.body.read())
        company = data['company']
        today = str(data['today'])
        address=data['address']
        address = address.split(',')
        meetingDate = int(today[:-3])
        mdate = time.strftime("%A,%B %d %Y,%H:%M %p", time.localtime(meetingDate))
        meetingDate = mdate.split(',')
        day = meetingDate[0]
        mdate = meetingDate[1]
        mtime = meetingDate[2]

        agenda_doc = db(db.doc.id == 38).select(db.doc.doc).first()
        org_file_name, file_stream = db.doc.doc.retrieve(agenda_doc['doc'])

        tpl = DocxTemplate(file_stream.name)

        context = {
                'company': company,
                'address': address,
                'country': "India",
                'day': day,
                'date': mdate,
                'time': mtime
            }
        tpl.render(context)
        fileName = 'AVM.docx'
        tpl.save(fileName)
        file_stream = open(fileName, 'rb')
        file_header = "attachment; filename=" + fileName
        response.headers['ContentType'] = "application/octet-stream"
        response.headers['Content-Disposition'] = file_header
        return response.stream(file_stream)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def generatePas4():
    def POST():
        data = js.loads(request.body.read())
        docId = data['doc_id']
        company = data['company']
        place = data['place']
        directorName = data['directorName']
        din = data['din']
        dirAddress = data['dirAddress']
        a = time.time()
        today = time.strftime("%B %d %Y", time.localtime(a))
        agenda_doc = db(db.doc.id == docId).select(db.doc.doc).first()
        org_file_name, file_stream = db.doc.doc.retrieve(agenda_doc['doc'])
        tpl = DocxTemplate(file_stream.name)
        context = {
                'company': company,
                'today': today,
                'directorName': directorName.title(),
                'din': din,
                'dirAddress': dirAddress,
                'place': place,
            }
        tpl.render(context)
        fileName = "PAS-4.docx"
        tpl.save(fileName)
        file_stream = open(fileName, 'rb')
        return response.stream(file_stream)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def generateAgenda():
    '''API to generate Agenda, Notice, Resolution, Minutes of meeting based on document id'''
    def GET(company,meeting):
        no = [a['id'] for a in db((db.board_meeting.company == company) &
                                  (db.board_meeting.meeting_type == meeting)).select()]
        meetingNo = len(no)
        if meetingNo==0:
            meetingNo = 1
            return json(meetingNo)
        meetingNo += 1
        return json(meetingNo)

    def POST():
        data = js.loads(request.body.read())
        docId = data['doc_id']
        if docId == 34 or docId == 39:
            short_matter = data['resolution']

            agenda = []
            for m in short_matter:
                long_agenda = db(db.agenda_table.short_agenda == m.strip()).select(db.agenda_table.long_agenda,
                                                                           db.agenda_table.BR).first()
                if long_agenda:
                    agenda.append(
                        {'long_agenda': long_agenda['long_agenda'], 'resolution': RichText(long_agenda['BR'])})
                else:
                    agenda.append({'long_agenda': m, 'resolution': ''})
            # agenda = RichText(agenda)
            agendaCount = len(agenda)
            meetingDate = str(data['bm_date'])
            company = data['companyName']
            address = data['address']
            place = data['place']
            serial = data['serial']
            director_name = data['director_name']
            din = data['din']
            dirAddress = data['dirAddress']
            position = data['position']

        elif docId == 13 or docId == 37 or docId == 14:
            meetingDate = str(data['bm_date'])
            company = data['companyName']
            address = data['address']
            place = data['place']
            serial = data['serial']
            short_matter = data['agenda']
            agenda = []
            for m in short_matter:
                long_agenda = db(db.agenda_table.short_agenda == short_matter[m]).select(db.agenda_table.long_agenda,
                                                                          db.agenda_table.BR).first()
                if long_agenda:
                    agenda.append(
                            {'long_agenda': long_agenda['long_agenda'], 'resolution': RichText(long_agenda['BR'])})
                else:
                    agenda.append({'long_agenda': m, 'resolution': ''})
            directorPresent=[]
            directorAbsent=[]
            if data['directorPresent']:
                for d in data['directorPresent']:
                    directorPresent.append(data['directorPresent'][d])
            if data['directorAbsent']:
                for d in data['directorAbsent']:
                    directorAbsent.append(data['directorAbsent'][d])
            if docId == 14:
                memberPresent = []
                memberAbsent = []
                if data['memberPresent']:
                    for m in data['memberPresent']:
                        memberPresent.append(data['memberPresent'][m])
                if data['memberAbsent']:
                    for m in data['memberAbsent']:
                        memberAbsent.append(data['memberAbsent'][m])

        elif docId == 12:
            meetingDate = str(data['bm_date'])
            company = data['companyName']
            director_name = data['director_name']
            din = data['din']
            dirAddress = data['dirAddress']
            address = data['address']
            state = data['state']
            place = data['place']
            serial = data['serial']
            venue = data['venue']
            co_director = data['co_director']

        else:
            meetingDate = str(data['bm_date'])
            company = data['companyName']
            office = data['office']
            cin = data['cin']
            director_name = data['director_name']
            din = data['din']
            dirAddress = data['dirAddress']
            address = data['address']
            state = data['state']
            place = data['place']
            serial = data['serial']
            short_matter = data['agenda']
            venue = data['venue']
            if docId in [31,32,35,10]:
                position = data['position']
            else:
                position = ''
            if docId in [30,43,44,36]:
                co_director = data['co_director']
            else:
                co_director = ''
            if docId == 44 or docId == 36:
                father_name = data['father_name']
            else:
                father_name = ''

            agenda=[]
            for m in short_matter:
                long_agenda = db(db.agenda_table.short_agenda == m).select(db.agenda_table.long_agenda, db.agenda_table.BR).first()
                if long_agenda:
                    agenda.append({'long_agenda':long_agenda['long_agenda'],'resolution':RichText(long_agenda['BR'])})
                else:
                    agenda.append({'long_agenda': m, 'resolution': ''})
            agendaCount = len(agenda)

        splitAddress = address.split(',')
        meetingDate = int(meetingDate[:-3])
        time.ctime(meetingDate)
        if docId in [13, 37, 14, 34, 39]:
            mdate = time.strftime("%A,%B %d %Y,%H:%M %p", time.localtime(meetingDate+19800))
        else:
            mdate = time.strftime("%A,%B %d %Y,%H:%M %p", time.localtime(meetingDate))
        meetingDate = mdate.split(',')
        day = meetingDate[0]
        mdate = meetingDate[1]
        d = datetime.datetime.strptime(meetingDate[2], '%H:%M %p')
        mtime = d.strftime("%I:%M %p")
        a = time.time()
        today = time.strftime("%B %d %Y", time.localtime(a))
        agenda_doc = db(db.doc.id == docId).select(db.doc.doc).first()
        org_file_name, file_stream = db.doc.doc.retrieve(agenda_doc['doc'])
        tpl = DocxTemplate(file_stream.name)
        if docId == 34 or docId == 39:
            context={
                'agenda':agenda,
                'company': company,
                'fullAddress': address,
                'country': "India",
                'day': day,
                'date': mdate,
                'time': mtime,
                'todayDate': today,
                'directorName': director_name.title(),
                'din': din,
                'dirAddress':dirAddress,
                'place': place,
                'serialno': serial,
                'position':position
            }

        elif docId ==13 or docId == 37:
            context = {
                'company': company,
                'address': splitAddress,
                'fullAddress': address,
                'country': "India",
                'day': day,
                'date': mdate,
                'time': mtime,
                'todayDate': today,
                'serialno': serial,
                'place' : place,
                'agenda' : agenda,
                'directorPresent':directorPresent,
                'directorAbsent':directorAbsent
            }
        elif docId == 14:
            context = {
                'company': company,
                'address': splitAddress,
                'fullAddress': address,
                'country': "India",
                'day': day,
                'date': mdate,
                'time': mtime,
                'todayDate': today,
                'serialno': serial,
                'place': place,
                'agenda': agenda,
                'directorPresent': directorPresent,
                'directorAbsent': directorAbsent,
                'memberPresent' : memberPresent,
                'memberAbsent' : memberAbsent
            }
        elif docId == 12:
            context = {
                'company': company,
                'address': splitAddress,
                'fullAddress': address,
                'state': state,
                'country': "India",
                'day': day,
                'date': mdate,
                'time': mtime,
                'todayDate': today,
                'directorName': director_name.title(),
                'din': din,
                'dirAddress': dirAddress,
                'place': place,
                'serialno': serial,
                'venue': venue,
                'coDirector':co_director,
            }
        else:
            context = {
            'company':company,
            'cin':cin,
            'address':splitAddress,
            'fullAddress' : address,
            'office' : office,
            'state' : state,
            'country' : "India",
            'day' : day,
            'date' : mdate,
            'time' : mtime,
            'todayDate':today,
            'directorName' : director_name.title(),
            'din' : din,
            'dirAddress': dirAddress,
            'place' : place,
            'matter' :agenda,
            'agendaCount':agendaCount,
            'serialno' : serial,
            'venue':venue,
            'coDirector': co_director,
            'position':position,
            'father':father_name
            }
        tpl.render(context)


        if docId == 9:
            fileName = "BM Notice.docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 13 or docId == 37 or docId ==14:
            fileName = "minutes of meeting.docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 12:
            fileName = "BM Shorter Consent-"+co_director.split()[0]+".docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 10:
            fileName = "EGM Notice.docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 30:
            fileName = "Body Corporate-Authorisation Form for attending EGM.docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 43:
            fileName = "Body Corporate _Shorter Consent - EGM.docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 44:
            fileName = "Individual_Shorter notice consent - EGM - "+co_director+".docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 31:
            fileName = "BM Agenda.docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 34 or docId == 39:
            fileName = 'Resolution true copy.docx'
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 35:
            fileName = 'AGM Agenda.docx'
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')
        if docId == 36:
            fileName = "Shorter notice consent - AGM - " + co_director + ".docx"
            tpl.save(fileName)
            file_stream = open(fileName, 'rb')

        file_header = "attachment; filename=" + fileName
        response.headers['ContentType'] = "application/octet-stream"
        response.headers['Content-Disposition'] = file_header
        return response.stream(file_stream)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getPlace():
    def GET():
        state_id = [s['id'] for s in db((db.state_or_province.country == '101')).select()]
        query = db.city.state_or_province.belongs(state_id)
        place = db(query).select(db.city.name)
        return json(place)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def generateAttendance():
    '''API to generate Attendance sheet for BM, EGM, AGM'''
    def POST():
        data = js.loads(request.body.read())
        docId = data['doc_id']
        strdate = str(data['meetingDate'])
        company=data['company']
        allDirector = data['allDirector']
        absentDirectors=data['absentDirector']
        serial = data['serial']
        place=data['place']
        Directors=[]
        Shareholder=[]

        if docId == 40 or docId == 41:
            absentShareholder = data['absentShareholder']
            presentShareholder = data['presentShareholder']
            allShareholder = data['allShareholder']
            for d in allDirector:
                if d in absentDirectors:
                    Directors.append({'name':d,'absent':'Absent'})
                else:
                    Directors.append({'name': d, 'absent': ''})
            for s in allShareholder:
                if s in absentShareholder:
                    Shareholder.append({'name': s, 'absent': 'Absent'})
                else:
                    Shareholder.append({'name': s, 'absent': ''})
        if docId == 33:
            for d in allDirector:
                if d in absentDirectors:
                    Directors.append({'name':d,'absent':'Absent'})
                else:
                    Directors.append({'name': d, 'absent': ''})
        addr = data['addr']
        meetingDate = int(strdate[:-3])
        mdate = time.strftime("%A,%B %d %Y,%H:%M %p", time.localtime(meetingDate+19800))
        meetingDate = mdate.split(',')
        day = meetingDate[0]
        mdate = meetingDate[1]

        strtime = meetingDate[2]

        dformat = datetime.datetime.strptime(strtime, "%H:%M %p")
        mtime = dformat.strftime("%I:%M %p")

        agenda_doc = db(db.doc.id == docId).select(db.doc.doc).first()
        org_file_name, file_stream = db.doc.doc.retrieve(agenda_doc['doc'])
        tpl = DocxTemplate(file_stream.name)
        if docId == 33:
            context={
            'company':company,
            'day':day,
            'time':mtime,
            'date':mdate,
            'fullAddress':addr,
            'tbl_contents':Directors,
            'serialNo':serial,
            'place':place
            }
        if docId == 40 or docId == 41:
            context={
            'company':company,
            'day':day,
            'time':mtime,
            'date':mdate,
            'fullAddress':addr,
            'tbl_contents':Directors,
            'shareholder': Shareholder,
            'serialNo':serial,
            'place':place
            }

        tpl.render(context)
        fileName = 'attendance.docx'
        tpl.save(fileName)

        file_stream = open(fileName, 'rb')
        return response.stream(file_stream)

    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def generateOfferLetter():
    '''API to generate offer letter'''
    def POST():
        data = js.loads(request.body.read())
        docId = data['doc_id']
        company=data['companyName']
        place=data['place']
        din=data['din']
        addr = data['address']
        directorName = data['director_name']
        a = time.time()
        today = time.strftime("%B %d %Y", time.localtime(a))
        agenda_doc = db(db.doc.id == docId).select(db.doc.doc).first()
        org_file_name, file_stream = db.doc.doc.retrieve(agenda_doc['doc'])
        tpl = DocxTemplate(file_stream.name)

        context={
            'company':company,
            'address':addr,
            'directorName':directorName,
            'din':din,
            'place':place,
            'todayDate':today
        }

        tpl.render(context)
        fileName = 'Offer Letter.docx'
        tpl.save(fileName)

        file_stream = open(fileName, 'rb')
        return response.stream(file_stream)

    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def uploadAgendaDoc():
    '''API to upload Agenda documents'''
    def POST(id,name,**fields):
        tableFields={}
        for key,files in fields.iteritems():
            filename = db.board_meeting[name].store(files, files.filename)
            tableFields[name]=filename
            ids = db(db.board_meeting.id == id).update(**tableFields)
            serial = db(db.board_meeting.id == id).select(db.board_meeting.serial).first()
            return json({'filename':filename,'serial':serial})
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def showAgendaDoc():
    '''API to download uploaded Agenda documents'''
    def GET(field,fileName):
        file, file_stream = db.board_meeting[field].retrieve(fileName)
        response.headers['Content-Disposition'] = '{0}'.format(file)
        return response.stream(file_stream)
    return locals()



@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def getFilename():
    '''Get uploaded filename for Meeting'''
    def GET(id,field):
        try:
            name = db(db.board_meeting.id==id).select(db.board_meeting[field]).first()
            return json(name[field])
        except:
            return json(None)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def updateBMSteps():
    '''Update Meeting steps on completing the step'''
    def GET(id):
        step = db(db.board_meeting.id==id).select(db.board_meeting.steps,db.board_meeting.process).first()
        return json(step)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def uploadResolution():
    '''API to upload CTC of BM, EGM, AGM'''
    def GET(id):
        resolution = db(db.board_meeting.id == id).select(db.board_meeting.serial ,db.board_meeting.resolution).first()
        return json(resolution)

    def POST(id,issue,reason,**doc):
        tablefields={}
        filesupload={}
        field={}
        count = 1
        resolution = db(db.board_meeting.id ==id).select(db.board_meeting.resolution).first()
        for key,files in doc.iteritems():
            if isinstance(files,list):
                for i, file in enumerate(files):
                    filename = db.mulfile.doc.store(file, file.filename)
                    filesupload[key+str(i+1)] = filename

            filename = db.board_meeting.resolution.store(files, files.filename)
            filesupload['file'] =filename
            filesupload['issueto']=issue
            filesupload['reason']=reason
            filesupload['date']= datetime.datetime.today().strftime('%Y-%m-%d')

        if resolution['resolution']:
            for i, r in enumerate(resolution['resolution']):
                field['resolution'+str(i+1)]=resolution['resolution'][r]
                count+=1
            field['resolution'+str(count)] = filesupload

            tablefields['resolution'] = field
        else:
            field['resolution1']=filesupload
            tablefields['resolution'] = field
        ids = db(db.board_meeting.id == id).update(**tablefields)
        return json(ids)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def showResolutionDoc():
    '''API to download uploaded CTC'''
    def GET(filename):
        file, file_stream = db.board_meeting.resolution.retrieve(filename)
        response.headers['Content-Disposition'] = '{0}'.format(file)
        return response.stream(file_stream)
    return locals()


@myjwt.allows_jwt()
@auth.requires_login()
@request.restful()
def sendOfferLetter():
    '''API to send offer letter email to all stakeholders'''
    def GET(id,company):
        filename = db(db.company_doc.id == id).select(db.company_doc.doc).first()
        pa = os.path.join(request.folder, 'uploads', filename['doc'])
        ids = db((db.company_stakeholder.company == company)&
                      (db.company_stakeholder.role == 'director')).select(db.company_stakeholder.user)
        dids=[]
        for id in ids:
            dids.append(id['user'])
        query = db.stakeholder.id.belongs(dids)
        director = db(query).select()
        if director:
            for d in director:
                if not (auth.settings.mailer.send(
                    to=d['email'],
                    subject="Offer letter",
                    message="Offer letter",
                    attachments=mail.Attachment(str(pa), content_id='document'))):
                    return {'msg': 'unable to sent mail'}
        return json(True)
    return locals()
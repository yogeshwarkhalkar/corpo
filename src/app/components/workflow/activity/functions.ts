import { UrlserviceService } from '../../../services/urlservice.service';
import { WorkflowService } from '../../../services/workflow.service';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

import * as _ from 'lodash';


export class WorkflowFunction{
	
	constructor(private workflow: WorkflowService) {
		// code...
	}

	
}
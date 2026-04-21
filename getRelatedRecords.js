import { LightningElement, api,track } from 'lwc';
import getRelatedRecords from '@salesforce/apex/ChildRecordsController.getRelatedRecords';

export default class DynamicRelatedList extends LightningElement {
    @api recordId;
    @track data=[];
    @api limitSize=5;
    error='';

     
     @api childObjectApiName= 'Contact'; 
     @api fieldList='Name, Email, Phone'; 
     @api lookupFieldApiName='AccountId';

    connectedCallback(){
    if(this.recordId){
        this.loadChildRecords();
    }
}
    async loadChildRecords(){
        try{
        console.log('Reached here');
        const result= await getRelatedRecords({
              recordId: this.recordId,
	          childObjectApiName: this.childObjectApiName, 
	          fieldList: this.fieldList, 
		      lookupFieldApiName: this.lookupFieldApiName,
              limitSize: this.limitSize

        });
        console.log('Reached here with data:' + JSON.stringify(result));
        this.data=result;
        }
        catch(e){
            console.log('reached here with error' + (e.body.message));
            this.data=[];
            this.error=e.body.message;
        }
    }

    get columns(){
        const fields= this.fieldList.split(',').map(f=>f.trim()).filter(Boolean);
        
        return fields.map(field=>({label:field, fieldName:field}))
    }

}

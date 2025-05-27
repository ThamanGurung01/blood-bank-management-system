import { parse } from "path"

export const formDataDeform=(formData:FormData,type:string)=>{
    try{
if(type==="user"){
    return {
        name:formData.get("name"),
        email:formData.get("email"),
        password:formData.get("password"),
        role:formData.get("role"),
    }
}else if(type==="donor"){
    return {
        blood_group:formData.get("blood_group"),
        age:formData.get("age"),
        location:JSON.parse(formData.get("location")as string),
        contact:formData.get("contact"),
    }
}else if(type==="blood_bank"){
    return {
        blood_bank:formData.get("blood_bank"),
         location:JSON.parse(formData.get("location")as string),
         contact:formData.get("contact"),
     }
}else if(type=== "new_blood_donation"){
    return {
        donor_name:formData.get("donor_name"),
        donor_contact:formData.get("donor_contact"),
        blood_type:formData.get("blood_type"),
        donation_type:formData.get("donation_type"),
        donor_address:formData.get("donor_address"),
        blood_units:parseInt(formData.get("blood_quantity")as string),
        collected_date:new Date(),
    }
    
    
}else if(type=== "existing_blood_donation"){
    return {
        age:parseInt(formData.get("age")as string),
        donorId:formData.get("donor_id"),
        blood_type:formData.get("blood_type"),
        donation_type:formData.get("donation_type"),
        blood_units:parseInt(formData.get("blood_quantity") as string),
        collected_date:new Date(formData.get("collected_date")as string),
        donor_address:formData.get("donor_address"),
    }

}else if(type==="blood_request"){
    return {
        patientName: formData.get("patientName"),
        hospitalName: formData.get("hospitalName"),
        hospitalAddress: formData.get("hospitalAddress"),
        blood_group: formData.get("blood_group"),
        blood_quantity: parseInt(formData.get("blood_quantity") as string),
        blood_component: formData.get("blood_component"),
        contactNumber: formData.get("contactNumber"),
        requestDate: new Date(formData.get("requestDate") as string),
        priorityLevel: formData.get("priorityLevel"),
        notes: formData.get("notes"),
    }

}else{
    return undefined;
}
    }catch(err){
        console.log(err);
        return undefined;
    }
}
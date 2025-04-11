export const formDataDeform=(formData:FormData,type:string)=>{
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
        blood_units:formData.get("blood_quantity"),
        collected_date:new Date(),
    }
    
    
}else if(type=== "existing_blood_donation"){
    return {
        donorId:formData.get("donor_id"),
        blood_type:formData.get("blood_type"),
        donation_type:formData.get("donation_type"),
        blood_units:formData.get("blood_quantity"),
        collected_date:new Date(formData.get("collected_date")as string),
        donor_address:formData.get("donor_address"),
    }

}else{
    return undefined;
}
}
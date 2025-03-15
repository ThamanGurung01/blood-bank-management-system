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
}else{
    return undefined;
}
}
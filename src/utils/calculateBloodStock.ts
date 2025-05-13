import { IBlood } from "@/models/blood.models";
export const calculateBloodStock =(bloodData: IBlood[]) => {
    try {
        
        const bloodStock = [
            { type: 'Whole Blood', units: 0, threshold: 30 },
            { type: 'RBC', units: 0, threshold: 100 },
            { type: 'Platelets', units: 0, threshold: 25 },
            { type: 'Plasma', units: 0, threshold: 80 },
            { type: 'Cryoprecipitate', units: 0, threshold: 15 }
          ];
        if (!bloodData) return { success: false, message: "Blood data is invalid" };
        bloodData.forEach((blood) => {
            if (blood.donation_type === "whole_blood") {
                const units=parseInt(blood.blood_units.toString());
                bloodStock[0].units += units;
            } else if (blood.donation_type === "rbc") {
                const units=parseInt(blood.blood_units.toString());
                bloodStock[1].units += units;
            } else if (blood.donation_type === "platelets") {
                const units=parseInt(blood.blood_units.toString());
                bloodStock[2].units += units;
            } else if (blood.donation_type === "plasma") {
                const units=parseInt(blood.blood_units.toString());
                bloodStock[3].units += units;
            } else if (blood.donation_type === "cryoprecipitate") {
                const units=parseInt(blood.blood_units.toString());
                bloodStock[4].units += units;
            }
        });
        return bloodStock;
    } catch (error) {
        console.log(error);
        return { success: false, message: "Something went wrong" };
    }
}
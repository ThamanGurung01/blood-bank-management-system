import { calculateDistance } from "./calculateDistance";
export const nearestDistance = (bloodStockData:any,hospitalCoords:any,priority:string)=>{
  const MAX_DISTANCE = priority === "Urgent" ? 10 : 150;
    const bloodBanksWithDistance = bloodStockData.map((item: { blood_bank: { location: { latitude: any; longitude: any; }; }; }) => {
        const bankCoords = {
          lat: item.blood_bank.location.latitude, 
          lon: item.blood_bank.location.longitude
        };
      
        const distance = Number(calculateDistance(hospitalCoords.lat,hospitalCoords.lon, bankCoords.lat, bankCoords.lon));
        return {
          ...item,
          distance
        };
      });
      return bloodBanksWithDistance .filter((item: any) => item.distance <= MAX_DISTANCE).sort((a:any, b:any) => a.distance - b.distance);
}
import { calculateDistance } from "./calculateDistance";
export const nearestDistance = (bloodStockData:any,hospitalCoords:any)=>{
    const bloodBanksWithDistance = bloodStockData.map((item: { blood_bank: { location: { latitude: any; longitude: any; }; }; }) => {
        const bankCoords = {
          lat: item.blood_bank.location.latitude, // adjust field names to match your schema
          lon: item.blood_bank.location.longitude
        };
      
        const distance = Number(calculateDistance(hospitalCoords.lat,hospitalCoords.lon, bankCoords.lat, bankCoords.lon));
      console.log("DIstance bet:",distance)
        return {
          ...item,
          distance
        };
      });
      return bloodBanksWithDistance.sort((a:any, b:any) => a.distance - b.distance);
}
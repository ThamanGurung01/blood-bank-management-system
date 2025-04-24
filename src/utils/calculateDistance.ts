export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const Distance=2*R*Math.asin(Math.sqrt(Math.sin(dLat /2)**2 +Math.cos(toRadians(lat1))*Math.cos(toRadians(lat2))*Math.sin(dLon /2)**2));
    console.log("Distance:",Distance.toFixed(2));
    return Distance.toFixed(2);
}
const getLatLong=async(query:string)=>{
try {
    if(!query) return null;
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
  .then(res => res.json())
  .then(data => {
    if (data.length > 0) {
      const { lat, lon } = data[0];
return { success: true, data:{lat,lon} };
    } else {
      console.log("Location not found");
      return {success:false, message:"Location not found"};
    }
  });
} catch (error) {
    console.error("Error fetching location data:", error);
    return {success:false, message:"Error fetching location data"};
}
}
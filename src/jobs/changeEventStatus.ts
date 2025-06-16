import Event from "@/models/event.models";
import { connectToDb } from "@/utils/database";

export async function changeEventStatus() {
  try {
    await connectToDb();
    const now = new Date();
    await Event.updateMany(
      {
        startDateTime: { $lte: now },
        endDateTime: { $gte: now },
      },
      { $set: { status: "ongoing" } }
    );
    await Event.updateMany(
      { endDateTime: { $lt: now } },
      { $set: { status: "completed" } }
    );

    return { success: true, message: "Event statuses updated." };
  } catch (error: any) {
    console.error("Error updating event statuses:", error);
    return { success: false, message: "Error updating statuses." };
  }
}

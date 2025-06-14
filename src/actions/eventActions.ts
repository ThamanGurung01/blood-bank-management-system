"use server";

import { connectToDb } from "@/utils/database";
import Event from "@/models/event.models";
import { formDataDeform } from "@/utils/formDataDeform";

export const createEvent = async (formData: FormData) => {
  try {
    await connectToDb();

    const eventData=formDataDeform(formData,"event");
    if(!eventData) return {
        success: false,
        message: "no from data",
      };
    if (!eventData.name || !eventData.startDateTime || !eventData.endDateTime || !eventData.location || !eventData.type || !eventData.createdBy) {
      return {
        success: false,
        message: "All required fields must be provided.",
      };
    }

    const newEvent = await Event.create({
      name: eventData.name,
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      location: eventData.location,
      type: eventData.type,
      description: eventData.description,
      createdBy: eventData.createdBy,
    });

    return {
      success: true,
      message: "Event created successfully.",
      data: newEvent,
    };

  } catch (error: any) {
    console.error("Error creating event:", error.message);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const updateEvent = async (eventId: string, formData: FormData) => {
  try {
    await connectToDb();

    const eventData = formDataDeform(formData, "event");
    if (!eventData) {
      return {
        success: false,
        message: "No form data provided.",
      };
    }

    if (!eventData.name ||!eventData.startDateTime ||!eventData.endDateTime ||!eventData.location ||!eventData.type) {
      return {success: false,message: "All required fields must be provided."};
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId,{
        name: eventData.name,
        startDateTime: eventData.startDateTime,
        endDateTime: eventData.endDateTime,
        location: eventData.location,
        type: eventData.type,
        description: eventData.description,
      },{ new: true });

    if (!updatedEvent) {
      return { success: false,message: "Event not found.",};}

    return {success: true,message: "Event updated successfully.", data: updatedEvent,};
    
  } catch (error: any) {
    console.error("Error updating event:", error.message);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};
"use server";

import { connectToDb } from "@/utils/database";
import Event from "@/models/event.models";
import { formDataDeform } from "@/utils/formDataDeform";
import { Types } from "mongoose";

export const createEvent = async (formData: FormData) => {
  try {
    await connectToDb();
    const eventData = formDataDeform(formData, "event");
    if (!eventData) return {
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
      data: JSON.parse(JSON.stringify(newEvent)),
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

    if (!eventData.name || !eventData.startDateTime || !eventData.endDateTime || !eventData.location || !eventData.type) {
      return { success: false, message: "All required fields must be provided." };
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, {
      name: eventData.name,
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      location: eventData.location,
      type: eventData.type,
      description: eventData.description,
    }, { new: true });

    if (!updatedEvent) {
      return { success: false, message: "Event not found.", };
    }

    return { success: true, message: "Event updated successfully.", data: JSON.parse(JSON.stringify(updatedEvent)), };

  } catch (error: any) {
    console.error("Error updating event:", error.message);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const getAllEvents = async (creatorId: string, type: string) => {
  try {
    await connectToDb();
    let eventData = [];
    if (type === "all") {
      eventData = await Event.find().populate(
        {
          path: "createdBy",
          populate: {
            path: "user",
            select: "name",
          },
        });
    } else if (type === "individual") {
      if (!creatorId) return { success: false, message: "creatorId required not found.", }
      eventData = await Event.find({
        createdBy: creatorId
      }).populate({
        path: "createdBy",
        populate: {
          path: "user",
          select: "name",
        },
      });
    }

     if (!eventData || eventData.length === 0) {
      return { success: false, message: "No events found." };
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(eventData))
    }
  } catch (error: any) {
    console.error("Error creating event:", error.message);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}

export const deleteEvent = async (eventId: string) => {
  try {
    if (!Types.ObjectId.isValid(eventId)) {
      return { success: false, message: "Invalid event ID." };
    }

    await connectToDb();

    const deleted = await Event.findByIdAndDelete(eventId);
    if (!deleted) {
      return { success: false, message: "Event not found or already deleted." };
    }
    return { success: true, message: "Event deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting event:", error.message);
    return { success: false, message: "An error occurred while deleting the event." };
  }
};
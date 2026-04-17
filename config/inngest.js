import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

/* ---------------- CREATE USER ---------------- */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await connectDB();

    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    });
  }
);

/* ---------------- UPDATE USER ---------------- */
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-updated" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await connectDB();

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    });
  }
);

/* ---------------- DELETE USER ---------------- */
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-deleted" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();

    await User.findByIdAndDelete(id);
  }
);
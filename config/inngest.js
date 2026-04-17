import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-created" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await User.create({
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    });
  }
);

export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-updated" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await connectDB();

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await User.findByIdAndUpdate(id, {
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    });
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-deleted" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    await User.findByIdAndDelete(event.data.id);
  }
);
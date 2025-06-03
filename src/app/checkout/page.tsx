import React from "react";
import { getAddressesByUser } from "../../zserver/actions/userAddressService";
import CheckoutClient from "./CheckoutClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Address } from "@/types/Address";

// Helper to get userId from cookie/session (adjust as per your auth)
async function getUserIdFromCookies() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  return userId ? Number(userId) : null;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ totalPrice?: string }>;
}) {
  const SearchParams = await searchParams;
  const userId = await getUserIdFromCookies();
  if (!userId) redirect("/login");

  // Fetch addresses on the server
  const addressesRaw = (await getAddressesByUser(userId)) as Address[];

  // Convert Sequelize instances to plain objects
  const addresses = addressesRaw.map((a) => ({
    id: a.id,
    street: a.street,
    city: a.city,
    state: a.state,
    postalCode: a.postalCode,
    country: a.country,
  }));

  // Pass a server action for address creation

  return (
    <CheckoutClient
      addresses={addresses}
      totalPrice={SearchParams.totalPrice || "0"}
      userId={userId}
    />
  );
}

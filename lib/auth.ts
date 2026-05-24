import { supabase } from "@/lib/supabase";

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getCurrentRole() {
  const profile = await getCurrentProfile();
  return profile?.role || "";
}

export async function logoutUser() {
  await supabase.auth.signOut();
  window.location.href = "/";
}

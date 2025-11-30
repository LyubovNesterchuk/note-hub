import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import { getServerMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile page",
  description: "User profile page with account details and settings.",
  openGraph: {
    title: "Profile page",
    description: "Page for viewing and editing your user profile, including account information and avatar.",
    url: "https://notehub.com/profile",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Profile page",
      },
    ],
    type: "website",
  },
};

export default async function ProfilePage() {
  const user = await getServerMe(); 

  const username = user?.username ?? "your_username";
  const email = user?.email ?? "your_email@example.com";
  const avatar = user?.avatar ?? "/default-avatar.jpg";

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
        </div>
      </div>
    </main>
  );
}

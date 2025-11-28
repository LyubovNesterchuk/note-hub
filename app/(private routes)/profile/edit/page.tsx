"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { getMe, updateMe, uploadAvatar } from "@/lib/api/clientApi"; // 👈 додали uploadAvatar
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] = useTransition(); // 👈 для стану завантаження при аплоаді

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        if (user) {
          setUsername(user.username ?? "");
          setEmail(user.email ?? "");
          setAvatar(
            user.avatar ?? "https://ac.goit.global/fullstack/react/default-avatar.jpg"
          );
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = { username };
      const updatedUser = await updateMe(payload);

      setUser(updatedUser);

      router.push("/profile");
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const handleCancel = () => router.push("/profile");

  // 👇 НОВЕ: завантаження аватарки
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      try {
        const url = await uploadAvatar(file); // PATCH /users/me/avatar
        setAvatar(url); // локально оновлюємо
        // опціонально: оновити юзера в сторі
        const user = await getMe();
        if (user) setUser(user);
      } catch (error) {
        console.error("Upload avatar error:", error);
      }
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {avatar ? (
          <div className={css.avatarBlock}>
            <Image
              src={avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />

            {/* 👇 НОВЕ: інпут для завантаження фото */}
            <label className={css.avatarLabel}>
              Change avatar:
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isPending}
                className={css.avatarInput}
              />
            </label>
          </div>
        ) : (
          <div className={css.avatarPlaceholder}>No Image</div>
        )}

        <form className={css.profileInfo} onSubmit={handleSaveUser}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// import { getMe, updateMe } from "@/lib/api/clientApi";
// import { useAuthStore } from "@/lib/store/authStore"; 
// import css from "./EditProfilePage.module.css";

// export default function EditProfilePage() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [avatar, setAvatar] = useState("/default-avatar.png");
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();
//   const setUser = useAuthStore((state) => state.setUser); 

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const user = await getMe();
//         if (user) {
//           setUsername(user.username ?? "");
//           setEmail(user.email ?? "");
//           setAvatar(user.avatar ?? "/default-avatar.png");
//         }
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const payload = { username };
//       const updatedUser = await updateMe(payload);

//       setUser(updatedUser);

//       router.push("/profile");
//     } catch (error) {
//       console.error("Update profile error:", error);
//     }
//   };

//   const handleCancel = () => router.push("/profile");

//   if (loading) return <p>Loading...</p>;

//   return (
//     <main className={css.mainContent}>
//       <div className={css.profileCard}>
//         <h1 className={css.formTitle}>Edit Profile</h1>

//         {avatar ? (
//           <Image
//             src={avatar}
//             alt="User Avatar"
//             width={120}
//             height={120}
//             className={css.avatar}
//           />
//         ) : (
//           <div className={css.avatarPlaceholder}>No Image</div>
//         )}

//         <form className={css.profileInfo} onSubmit={handleSaveUser}>
//           <div className={css.usernameWrapper}>
//             <label htmlFor="username">Username:</label>
//             <input
//               id="username"
//               type="text"
//               className={css.input}
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>

//           <p>Email: {email}</p>

//           <div className={css.actions}>
//             <button type="submit" className={css.saveButton}>
//               Save
//             </button>
//             <button
//               type="button"
//               className={css.cancelButton}
//               onClick={handleCancel}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }
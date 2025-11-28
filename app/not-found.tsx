import css from "./Home.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page not found",
  description: "Sorry, the page you are looking for does not exist.",
  
  openGraph: {
    title: "404 - Page not found",
    description: "Sorry, the page you are looking for does not exist.",
    url: "https://notehub.com/not-found",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "404 - Page not found",
      },
    ],
    type: "website",
  },
};

export default function NotFound() {
  return (
    <div className={css.notFoundContainer}>
      <h1 className={css.notFoundTitle}>404</h1>
      <p className={css.notFoundDescription}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
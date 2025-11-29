import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";

import NotesClient from "./Notes.client";
import { fetchServerNotes } from "@/lib/api/serverApi";

type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "All";

  return {
    title: tag === "All" ? "Notes - All Users" : `Notes - ${tag}`,
    description: "Your notes",

    openGraph: {
      title: tag === "All" ? "Notes - All Users" : `Notes - ${tag}`,
      description: `My ${tag} notes`,
      url: `https://notehub.com/notes/${tag}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: tag === "All" ? "Notes - All Users" : `Notes - ${tag}`,
        },
      ],
      type: 'website',
    },
  }
}

export default async function NotesPage({ params }: NotesPageProps) {

  const { slug = [] } = await params;
  const tag = slug[0] && slug[0] !== "All" ? slug[0] : undefined;

  const queryClient = new QueryClient();


await queryClient.prefetchQuery({
  queryKey: ["notes", { search: "", page: 1, tag: tag ?? null }],
  queryFn: () => fetchServerNotes("", 1, 12, tag),
});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <NotesClient tag={tag ?? ""} /> */}
<NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
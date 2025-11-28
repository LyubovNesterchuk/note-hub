import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

// ------------------ Notes ------------------

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchServerNotes = async (
  search: string,
  page = 1,
  perPage = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const params: Record<string, string | number> = {
    search,
    page,
    perPage,
  };

  if (tag && tag !== "all") {
    params.tag = tag;
  }

  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};


export const fetchServerNoteById = async (noteId: string): Promise<Note> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<Note>(`/notes/${noteId}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  return data;
};


// -- Auth ------------------

export const checkServerSession = async () => {
  
  const cookieStore = await cookies();
  
  const res = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  
  return res;
};

// ------------------ User ------------------

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });

  return data;
};

export const updateServerMe = async (payload: Partial<User>): Promise<User> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.patch<User>("/users/me", payload, {
    headers: { Cookie: cookieStore.toString() },
  });

  return data;
};



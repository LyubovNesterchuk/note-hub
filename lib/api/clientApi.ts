import { NewNote, Note } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
};

export const fetchNotes = async (
  search: string,
  page = 1,
  perPage = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    search,
    page,
    perPage,
  };

  if (tag && tag !== "all") {
    params.tag = tag;
  }

  const { data } = await nextServer.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${noteId}`);
  return data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const { data } = await nextServer.post<Note>("/notes", newNote);
  return data;
};

export const updateNote = async (
  noteId: string,
  updatedNote: Partial<NewNote>
): Promise<Note> => {
  const { data } = await nextServer.patch<Note>(`/notes/${noteId}`, updatedNote);
  return data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${noteId}`);
  return data;
};


// ----------------------------------------------------------------------------

export type RegisterRequest = { 
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};



export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};



type CheckSessionRequest = {
  success: boolean;
};


export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};


export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};



export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};


export type UpdateUserRequest = {
  username?: string;
  email?: string;
  avatar?: string;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const { data } = await nextServer.patch<User>("/users/me", payload);
  return data;
};



export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", file); // ВАЖЛИВО: той самий ключ, що в upload.single("avatar")

  const { data } = await nextServer.patch<{ url: string }>("/users/me/avatar", formData, {
    headers: {
      // НЕ ставимо manually Content-Type, браузер сам проставить boundary для multipart/form-data
    },
  });

  return data.url; // це буде user.avatar з бекенда
};

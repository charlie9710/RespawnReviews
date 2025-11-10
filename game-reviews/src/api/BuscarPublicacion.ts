export interface publicacion {
  created_at: string;
  id: number;
  content: string;
  img: string;
  title: string;
  type: string;
  userName: string;
  fechaCreacion: string;
}

export async function fetchPosts(
  type: string,
  gameId: number
): Promise<publicacion[]> {
  const url = `http://localhost:8080/api/posts/${gameId}/${type}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

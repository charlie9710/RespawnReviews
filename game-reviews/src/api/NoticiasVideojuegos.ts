export interface Noticia {
  title: string;
  body: string;
  urlToImage: string;
  id: number;
  url: string;
}

export async function Noticias(
  page: Number,
  pageSize: Number
): Promise<Noticia[]> {
  const clientId = import.meta.env.VITE_NEWS_API_KEY;
  const url = `/news/everything?q=video+games&page=${page}&pageSize=${pageSize}&language=es&sortBy=publishedAt&apiKey=${clientId}`;
  const result = await fetch(url);
  const data = await result.json();
  return data.articles;
}

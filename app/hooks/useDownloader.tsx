import axios from "axios";
import useSWRMutation from "swr/mutation";

const fetcher = async (url: string, { arg }: { arg: string }) => {
  const { data } = await axios.post(`/api/d/${url}`, { url: arg });
  if (!data.status) throw new Error(data.error || "Unknown error");
  return data.data;
};

export default function useDownloader(engine: string) {
  const { trigger, data, error, isMutating } = useSWRMutation(engine, fetcher);
  return { trigger, data, error, isLoading: isMutating };
}

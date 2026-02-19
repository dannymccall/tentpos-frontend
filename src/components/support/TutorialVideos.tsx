import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { SpinnerCustom } from "../loaders/Spinner";
import type { TutorialVideoProps } from "@/types/ticket.types";
import VideoCard from "./VideoCard";
import NoDataFound from "../NoDataFound";

const TutorialVideos = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await api.get<{ data: TutorialVideoProps[] }>(
        `/api/tutorial/videos`,
      );
      // console.log(res);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });


  if (isLoading) {
    return <SpinnerCustom />;
  }

  if (!data || data.length === 0) return <NoDataFound onRefresh={refetch}/>;

  return (
    <div className="flex flex-col gap-3 w-full p-5">
      {data?.map((video) => (
        <VideoCard video={video} />
      ))}
    </div>
  );
};

export default TutorialVideos;

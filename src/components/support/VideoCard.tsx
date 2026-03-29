"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { TutorialVideoProps } from "@/types/ticket.types";

export const toYoutubeEmbed = (url: string) => {
  let id = "";

  if (url.includes("youtu.be/")) {
    id = url.split("youtu.be/")[1];
  } else if (url.includes("v=")) {
    id = url.split("v=")[1].split("&")[0];
  }

  return `https://www.youtube.com/embed/${id}?autoplay=1`;
};

const VideoCard = ({ video }: { video: TutorialVideoProps }) => {
  const [open, setOpen] = useState(false);

  const thumbnail = `https://img.youtube.com/vi/${video.link.split("v=")[1]}/hqdefault.jpg`;

  return (
    <>
      {/* Card */}
      <Card
        className="cursor-pointer hover:shadow-xl transition"
        onClick={() => setOpen(true)}
      >
        <CardHeader>
          <CardTitle>{video.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3">
           <img // Thumbnail
              src={thumbnail}
              alt={video.title}
              className="w-32 h-20 object-cover rounded-md text-red-600"
            />
            <div>
              <CardDescription className="font-semibold text-sm md:text-base">
                {video.description}
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={toYoutubeEmbed(video.link)}
              className="w-full aspect-video rounded-xl"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;

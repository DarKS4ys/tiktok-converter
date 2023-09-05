"use client"

import { useRef, useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import clsx from "clsx";
import axios from "axios";
import Image from "next/image";
import Download from "./components/Download";
import {AiFillEye, AiFillYoutube} from 'react-icons/ai'
import {FiExternalLink, FiLoader} from 'react-icons/fi'
import SocialLink from "./components/SocialLink";
import Link from "next/link";
import { BsMusicNote, BsTrash } from "react-icons/bs";
import {FaHeart, FaCommentAlt} from "react-icons/fa"



export default function Home() {
  const inputUrlRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const [urlResult, setUrlResult] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [videoViews, setVideoViews] = useState<number | null>(null);
  const [videoLikes, setVideoLikes] = useState<number | null>(null);
  const [videoComments, setVideoComments] = useState<number | null>(null);
  
  const [videoMusic, setVideoMusic] = useState<string | null>(null);
  const [defaultQuality, setDefaultQuality] = useState<string | null>(null);
  const [betterQuality, setBetterQuality] = useState<string | null>(null);
  const [HDQuality, setHDQuality] = useState<string | null>(null);

  // updates the input value everytime the input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const RumbleIcon = 'RumbleIcon.svg'
  const YTMusicIcon = 'YtMusicIcon.svg'
  
  function formatInteractionCount(count: number) {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return (count / 1000000).toFixed(1) + 'M';
    }
  }
  
  // What happens when the user presses on search button
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputUrlRef.current !== null) {
      const tiktokUrl = (inputUrlRef.current.value)
      const tiktokUrlPattern = /^https:\/\/(www\.)?tiktok\.com\//;
      console.log(tiktokUrl);

      // Code to connect to rapid api
      if (tiktokUrlPattern.test(tiktokUrl)) {
        console.log("Valid TikTok URL:", tiktokUrl);
        setLoading(true);
      const options = {
        method: 'GET',
        url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/',
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
          'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
        },
        params: {
          url: tiktokUrl,
          hd: '1' // have to be made dynamic
        }
      }
      
      // What to do after connected to api
      axios(options)
      .then(response => {
        const defaultQuality = response.data.data.play;
        const betterQuality = response.data.data.wmplay;
        const hDQuality = response.data.data.hdplay;
        const videoMusic = response.data.data.music;

        const videoTitle = response.data.data.title;
        const videoThumbnail = response.data.data.cover;
        const videoViews = response.data.data.play_count;
        const videoLikes = response.data.data.digg_count;
        const videoComments = response.data.data.comment_count;

        setThumbnailUrl(videoThumbnail)
        setUrlResult(response.data.data)
        setVideoTitle(videoTitle)
        setVideoViews(videoViews)
        setVideoLikes(videoLikes)
        setVideoComments(videoComments)

        setDefaultQuality(defaultQuality)
        setBetterQuality(betterQuality)
        setHDQuality(hDQuality)
        setVideoMusic(videoMusic)

        console.log('Default Quality:' + defaultQuality)
        console.log('Better Quality:' + betterQuality)
        console.log('HD Quality:' + hDQuality)

      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      })
      inputUrlRef.current.value = "";
      } else {
        console.log("THIS IS NOT A VALID LINK")
      }
    }
  };

  const placeholderImageUrl = "/placeholder.jpg";

  return (
    <main className="flex flex-col justify-center items-center w-full sm:h-screen h-full text-center gap-4 p-8">
      <h1 className="text-5xl font-semibold text-blue-400">
        TikTok <span className="text-white">Converter</span>
      </h1>
      <section className="sm:w-[50rem] gap-4 flex flex-col">
        <p className="text-xl">
          Transform TikTok videos into MP4 in just a few clicks
        </p>

        <form onSubmit={handleSubmit} className="gap-3 flex">
          <Input
            ref={inputUrlRef}
            type="text"
            placeholder="Enter the link of the desired audio"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            className={clsx("!w-36", {
              "cursor-not-allowed hover:bg-transparent text-[--border] hover:ring-offset-0 hover:ring-0": inputValue === "",
            })}
            type="submit"
            disabled={inputValue === ""}
          >
            {inputValue === "" ? "Empty" : "Search"}
          </Button>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <FiLoader size={48} className="animate-spin"/>
          </div>
        ) : urlResult ? (
          <>
            <div className="md:items-start md:justify-start md:flex-row flex flex-col gap-4 items-center justify-center">
              <div className="flex flex-col gap-3 w-56">
              <Link className="w-56 h-80" target="_blank" href={inputValue || "cantfindvideo"}>
                  <div className="relative group">
                      <Image
                        alt="Video Thumbnail"
                        src={thumbnailUrl || placeholderImageUrl}
                        width={640}
                        height={480}
                        className="w-56 h-80"
                      />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                      <FiExternalLink className="h-10 w-10 group-hover:text-white transition group-hover:opacity-100 opacity-0" />
                    </div>
                  </div>
                </Link>
                { videoTitle ?
                 <h1 className="md:text-2xl font-semibold text-lg overflow-hidden whitespace-nowrap">
                 {videoTitle.length > 14
                   ? `${videoTitle.slice(0, 12)}...`
                  : videoTitle}
                  </h1>
                : null}
                <div className="flex gap-4 justify-center items-center">
                { videoViews ?
                <div className="flex items-center justify-center gap-1">
                  <p>{formatInteractionCount(videoViews)}</p>
                  <AiFillEye/>
                </div>
                : null}
                { videoLikes ?
                <div className="flex items-center justify-center gap-1">
                  <p>{formatInteractionCount(videoLikes)}</p>
                  <FaHeart/>
                  </div>
                : null}

                { videoComments ?
                  <div className="flex items-center justify-center gap-1">
                  <p>{formatInteractionCount(videoComments)}</p>
                  <FaCommentAlt/>
                  </div>
                : null}
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full p-2">
                { HDQuality ? 
                  <Download definition={'HD'} downloadUrl={HDQuality} quality={'Best Quality'}></Download>
                : null}


                { betterQuality ? 
                  <Download definition={'SD+'} downloadUrl={betterQuality} quality={'Better Quality'}></Download>
                : null}

                { defaultQuality ? 
                  <Download definition={'SD'} downloadUrl={defaultQuality} quality={'SD Quality'}></Download>
                : null}

                <Button 
                className="group p-3 font-semibold text-stone-300 hover:text-white transition"
                onClick={() => {
                  setUrlResult(null)
                  setInputValue("")
                }}>
                  <p className="group-hover:opacity-0 transition">Remove</p>
                  <BsTrash className="group-hover:-translate-x-7 transition group-hover:scale-125"/>
                </Button>
              </div>
            </div>
          </>
        ) : null}
          <hr className="border-[--border]"/>
        <div className="flex justify-center items-center gap-4">
          <SocialLink link="/ytmp4" icon={AiFillYoutube} iconSize={64}/>
          <SocialLink link="/rumble">
            <Image width={36} height={36} src={RumbleIcon} alt="Rumble Icon"/>
          </SocialLink>
          <SocialLink iconSize={36} icon={BsMusicNote} link="/ytmp3">
          </SocialLink>
        </div>
      </section>
    </main>
  );
}
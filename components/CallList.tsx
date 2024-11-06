// 
"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/node-sdk";
import { Call } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "@/hooks/use-toast";



const CallList = (type: { type: "ended" | "upcoming" | "recordings" }) => {
  const { ended, upcomings, recorded, isLoading } = useGetCalls();
  const router = useRouter();
  const [callRecordings, setCallRecordings] = useState<CallRecording[]>([]);
  const getCalls = () => {
    switch (type.type) {
      case "ended":
        return ended;
      case "recordings":
        return recorded;
      case "upcoming":
        return upcomings;
      default:
        return [];
    }
  };
  const toast = useToast()

  const getNoCallsMessage = () => {
    switch (type.type) {
      case "ended":
        return "NO Previous Calls";
      case "recordings":
        return "NO Previous Calls";
      case "upcoming":
        return "NO Upcoming Calls";
      default:
        return "No Calls";
    }
  };

  useEffect(()=>{
    const fetchrecordings = async()=>{
        try {
            const calldata = recorded ? await Promise.all(recorded.map((meeting) => meeting.queryRecordings())) : [];
            const recordings = calldata.filter(call => call.recordings.length > 0).flatMap(call => call.recordings);
            setCallRecordings(recordings.map(recording => ({
                ...recording,
                end_time: new Date(recording.end_time),
                start_time: new Date(recording.start_time)
            })));
        } catch (error) {
            toast.toast({ 
                title: `${error}`,
            })
        }
    }

    if (type.type === "recordings") fetchrecordings()
  },[type.type,recorded])

  const calls = getCalls();
  const callsmessage = getNoCallsMessage();
  console.log(calls)
  if (isLoading) {
    return <Loader/>;
  }
  
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type.type === 'ended'
                ? '/icons/previous.svg'
                : type.type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              'No Description'
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type.type === 'ended'}
            link={
              type.type === 'recordings'
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
            }
            buttonIcon1={type.type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type.type === 'recordings' ? 'Play' : 'Start'}
            handleClick={
              type.type === 'recordings'
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{callsmessage}</h1>
      )}
    </div>
  );
};

export default CallList;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Description } from "@radix-ui/react-dialog";
import { useToast } from "@/hooks/use-toast"

const MeetingTypeList = () => {
  const {toast} = useToast();
  const {user} = useUser();
  const  client = useStreamVideoClient();
  const [values,setValues]  =  useState({
    dateTime : new Date(),
    Description:'',
    link : ''
  })

  const [calldestails,setCallDetails] = useState <Call>()
    const createMeeting = async ()=>{
      if (!client || !user) return

      try {

        if(!values.dateTime){
          toast({
            variant: "destructive",
            title: "please select date and time",
          })
          return
        }
        const id = crypto.randomUUID();
        const call = client.call ('default',id);

        if (!call) throw new Error ('Failed to create call');
        const startAt = values.dateTime.toISOString() ||  new Date(Date.now()).toISOString()
        const description = values.Description || 'Instant Meeting'

        await call.getOrCreate({
          data:{
            starts_at: startAt,
            custom : {
              description: description
            }
          }
        })

        setCallDetails(call)
        if (!values.Description){
          router.push(`/meeting/${call.id}`)
        }

        toast({
          
          title: "Meeting created ",
        })

      }
      catch (error) {
        console.log(error)
        toast({
          variant: "destructive",
          title: "Failed to create a Meeting",
        })
      }

    }
  const router = useRouter();
  const [meetingstate, setmeetingstate] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        color="bg-orange-1"
        title="New Meeting"
        description="Start an Instant Meeting"
        handleClick={() => setmeetingstate("isInstantMeeting")}
      />

      <HomeCard
        img="/icons/Schedule.svg"
        color="bg-blue-1"
        title="Schedule Meeting"
        description="Plan your Meeting"
        handleClick={() => setmeetingstate("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        color="bg-purple-1"
        title="view Recording"
        description="Check out your Recordings"
        handleClick={() => router.push("/recordings")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        color="bg-yellow-1"
        description="Via Invitaion link"
        title="join Meeting"
        handleClick={() => setmeetingstate("isJoiningMeeting")}
      />
      <MeetingModal
      
        isOpen = {meetingstate === 'isInstantMeeting'}
        onClose = {() => setmeetingstate(undefined)}
        title = "Instant Meeting"
        className = "text-center"
        buttonText = "Start Meeting"
        handleClick = {createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;

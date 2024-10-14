"use client";
import React, { useState } from "react";
import Image from "next/image";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
const MeetingTypeList = () => {
    const createMeeting = ()=>{

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

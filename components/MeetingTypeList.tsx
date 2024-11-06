"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "@/components/ui/input"


const MeetingTypeList = () => {
  const {toast} = useToast();
  const {user} = useUser();
  const  client = useStreamVideoClient();
  const [values,setValues]  =  useState({
    dateTime : new Date(),
    Description:'',
    link : ''
  })

  const [calldetails,setCallDetails] = useState <Call>()
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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${calldetails?.id}`;
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

      { !calldetails ?  (
        <MeetingModal 
        isOpen = {meetingstate === 'isScheduleMeeting'} 
        onClose = {() => setmeetingstate(undefined)} 
        title = "Create Meeting" 
        handleClick = {createMeeting} 
        className="text-center"
        
        >

            <div className="flex flex-col gap-2.5" >

              <label 
              className=" text-base  text-normal leading-[22px] text-sky-2 "
              >
                 Add a Description
              
              </label>

              
              <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus:visible:ring-offset-0" 
              
              onChange={(e) => setValues({...values,Description:e.target.value})}
              />

            </div>

            <div className="flex w-full flex-col gap-2.5" >

            <label 
              className=" text-base  text-normal leading-[22px] text-sky-2 "
              >
                 Select Date and Time
              
              </label>

              <ReactDatePicker 
              selected={values.dateTime}
              onChange={(date)=> setValues({...values,dateTime:date!})}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className="w-full rounded bg-dark-3 p-2 focus:outline-none "
              />

            </div>

        </MeetingModal>
      ) : (
        <MeetingModal 
        isOpen = {meetingstate === 'isScheduleMeeting'} 
        onClose = {() => setmeetingstate(undefined)} 
        title = "Meeting Created" 
        className="text-center"
        handleClick = {()=> {navigator.clipboard.writeText(meetingLink); toast({title:"Meeting Link Copied"})  }}
        image="/icons/checked.svg"
        buttonIcon="/icons/copy.svg"
        buttonText="Copy Meeting Link"
      />
      )
      
      
      }

      <MeetingModal
      
        isOpen = {meetingstate === 'isInstantMeeting'}
        onClose = {() => setmeetingstate(undefined)}
        title = "Instant Meeting"
        className = "text-center"
        buttonText = "Start Meeting"
        handleClick = {createMeeting}
      />

    <MeetingModal
      
      isOpen = {meetingstate === 'isJoiningMeeting'}
      onClose = {() => setmeetingstate(undefined)}
      title = "type link here"
      className = "text-center"
      buttonText = "Join Meeting"
      handleClick = {()=> router.push(values.link)}
    >
      <Input
      placeholder="meeting link"
      className = "border-none bg-dark-3 focus:visible:ring-0 focus-visible:ring-offset-0"
      onChange={(e) => setValues({...values,link:e.target.value})}
      />
    </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;

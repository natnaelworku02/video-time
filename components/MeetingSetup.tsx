'use client'
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'


interface props{
  setIsSetUpComplete:(value:boolean)=> void;
}

const MeetingSetup = ({setIsSetUpComplete}:props) => {

  const [isMicCamToggled,setMicCamToggled] = useState(false)
  const call = useCall()

  useEffect(()=>{
    if (isMicCamToggled){
      call?.camera.disable()
      call?.microphone.disable()

    }
    else{
      call?.camera.enable()
      call?.microphone.enable()
    }

  },[isMicCamToggled,call?.camera,call?.microphone])

  return (
    <div className=' flex h-screen w-full flex-col items-center justify-center gap-3 text-white ' >
      <h1 className='text-2xl font-bold ' >  Set up </h1>
      <VideoPreview/>
      <div className='flex h-16 items-center justify-center gap-3' >

        <label  className='flex items-center justify-center gap-2 font-medium ' htmlFor="">
        <input 
        type="checkbox"
        checked = {isMicCamToggled}
        onChange={(e)=> setMicCamToggled(e.target.checked)}
        
        />
        join with mic and camera off 
        </label>

        <DeviceSettings/>

      </div>
      <Button 
      className=' rounded-md bg-green-500 px-4 py-2.5 ' 
      onClick={()=> {
        call?.join()
        setIsSetUpComplete(true)
      }}
      >
        join metting
      </Button>
    </div>
  )
}

export default MeetingSetup
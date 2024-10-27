'use client'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import React, { useState,useEffect } from 'react'

const useGetCallById = (id:string | string[]) => {
    const [call,setcall] = useState <Call>()
    const [isCallLoading,setIsCallLoading] = useState(true)

    const client = useStreamVideoClient()

    useEffect(()=>{
        if(!client) return;

        const loadCall = async ()=>{
            const {calls} = await client.queryCalls({
                filter_conditions:{
                    id
                }
            })

            if (calls.length > 0) setcall(calls[0])
                setIsCallLoading(false)
        }

        loadCall();

    },[client,id])
    
    return {call,isCallLoading}
}

export default useGetCallById
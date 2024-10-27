"use server"

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey =process.env.NEXT_PUBLIC_STREAM_API_KEY;

const apisecrect = process.env.STREAM_SECRECT_KEY

export const tokenProvider = async ()=>{

    const user = await currentUser()

    if (!user) throw new Error ("user is not logged in");
    if (!apiKey) throw new Error ("stream api key is missing")
    if (!apisecrect) throw new Error ("stream secret key is missing")
    
    const client = new StreamClient(apiKey,apisecrect);
    const exp = Math.round(new Date().getTime() / 1000) + 3600
    const issued = Math.floor(Date.now() / 1000) - 60

    const token = client.generateUserToken({
        user_id: user.id,
        exp : exp,
        iat : issued,
    })
    return token
}
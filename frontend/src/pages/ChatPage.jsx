import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import CallButton from "../components/CallButton";

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data:tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, //this will run if authUser is available
  });

  useEffect(() => {
  let isMounted = true;
  const initChat = async () => {
    if (!tokenData?.token || !authUser) return;

    try {
      console.log("Initializing Stream chat client...");

      const client = StreamChat.getInstance(STREAM_API_KEY);

      // If there's already a user connected, disconnect first
      if (client.user) {
        console.log("Disconnecting existing user...");
        await client.disconnectUser();
      }

      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePics,
        },
        tokenData.token
      );

      const channelId = [authUser._id, targetUserId].sort().join("-");
      const currChannel = client.channel("messaging", channelId, {
        members: [authUser._id, targetUserId],
      });

      await currChannel.watch();

      if (isMounted) {
        setChatClient(client);
        setChannel(currChannel);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initializing Chat: ", error);
      toast.error("Could not connect to chat. Please try again.");
      setLoading(false);
    }
  };

  initChat();

  return () => {
    isMounted = false;
    const client = StreamChat.getInstance(STREAM_API_KEY);
    if (client && client.user) {
      client.disconnectUser();
    }
  };
}, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
  if (!channel?.id) {
    toast.error("Call ID is missing. Cannot start call.");
    return;
  }

  const callUrl = `${window.location.origin}/call/${channel.id}`;

  channel.sendMessage({
    text: `I've started a video call. Join me here: ${callUrl}`,
  });

  toast.success("Video Call link sent successfully!");
};

  //console.log(id);
 if (loading || !chatClient || !channel) {
  return <div className="flex justify-center items-center h-[93vh]">Loading chat...</div>;
}

return (
  <div className="h-[88vh]">
    <Chat client={chatClient}>
      <Channel channel={channel}>
        <div className="w-full relative">
          <CallButton handleVideoCall={handleVideoCall}/>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
        </div>
      </Channel>
    </Chat>
  </div>
);

};

export default ChatPage;

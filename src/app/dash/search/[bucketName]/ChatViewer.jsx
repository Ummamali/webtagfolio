import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeChats } from "../../../../store/ChatsSlice";
import ReplyMsgBox from "./ReplyMsgBox";
import Image from "next/image";

export default function ChatViewer({ bucketName }) {
  const chatState = useSelector((state) => state.chats);
  const bucketState = useSelector((state) => state.buckets);
  const userState = useSelector((state) => state.user);
  const userId = userState.userId;
  const thisBucketItems =
    bucketState.dataItems[bucketState.indicesMap[bucketName]].items;
  const thisBucketChats = chatState[bucketName];
  const dispatchStore = useDispatch();
  useEffect(() => {
    if (thisBucketChats === undefined) {
      dispatchStore(initializeChats({ bucketName: bucketName }));
    }
  }, []);
  return (
    <main className="flex flex-col-reverse h-[71vh] py-4 overflow-y-scroll myScrollbar mb-3">
      {chatState.__agent_thinking ? (
        <div className="bg-gray-400/20 px-3 py-2 rounded inline-block mr-auto mt-3">
          <Image
            width={28}
            height={28}
            src="/thinking.gif"
            className="opacity-80"
          />
        </div>
      ) : null}
      {thisBucketChats !== undefined
        ? thisBucketChats.map((msg) =>
            msg.type === "QUERY" ? (
              <div className="flex justify-end mt-3 text-sm">
                <p className="bg-mainAccent text-white/70 px-3 py-2 mr-2">
                  {msg.text}
                </p>
              </div>
            ) : (
              <ReplyMsgBox
                bucketName={bucketName}
                text={msg.text}
                mediaIdcs={msg.mediaIdcs}
                thisBucketItems={thisBucketItems}
                userId={userId}
              />
            )
          )
        : null}
    </main>
  );
}

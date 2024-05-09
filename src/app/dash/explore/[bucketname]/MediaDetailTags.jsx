import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { bucketsActions } from "../../../../store/BucketsSlice";

export default function MediaDetailTags({
  mediaItem,
  bucketname,
  setMediaItem,
}) {
  const [newObjectTag, setNewObjectTag] = useState("");
  const [newPeopleTag, setNewPeopleTag] = useState("");
  const dispatch = useDispatch();
  return (
    <div>
      <div>
        <h3 className="text-gray-400 text-xl mb-1">Object Tags</h3>
        <div className="flex flex-wrap space-x-2">
          {mediaItem.tags.objects.map((t, i) => (
            <p
              className="border border-gray-500 rounded-sm py-1 px-6 text-gray-400 text-sm my-1"
              key={t}
            >
              {t}
            </p>
          ))}
          <form
            className="flex items-center space-x-2 border border-gray-500 rounded-sm px-3 w-[200px]"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(
                bucketsActions.objectTagAdded({
                  bucketname,
                  index: mediaItem.index,
                  newTag: newObjectTag,
                })
              );
              setMediaItem((prev) => {
                const newState = JSON.parse(JSON.stringify(prev));
                newState.tags.objects.push(newObjectTag);
                return newState;
              });
              setNewObjectTag("");
            }}
          >
            <input
              type="text"
              className="block !py-0 !px-0 !text-sm !border-none !border-gray-500 !bg-transparent"
              placeholder="new tag..."
              value={newObjectTag}
              onChange={(e) => setNewObjectTag(e.target.value)}
            />
            <button className="-mb-1" type="submit">
              <span className="material-symbols-outlined leading-none text-mainAccent">
                add
              </span>
            </button>
          </form>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-400 text-xl mb-1">People</h3>
        <div className="flex flex-wrap space-x-2">
          {mediaItem.tags.people.map((t, i) => (
            <p className="border border-gray-500 rounded-sm py-1 px-6 text-gray-400 text-sm my-1">
              {t}
            </p>
          ))}
          <form
            className="flex items-center space-x-2 border border-gray-500 rounded-sm px-3 w-[200px]"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(
                bucketsActions.peopleTagAdded({
                  bucketname,
                  index: mediaItem.index,
                  newTag: newPeopleTag,
                })
              );
              setMediaItem((prev) => {
                const newState = JSON.parse(JSON.stringify(prev));
                newState.tags.people.push(newPeopleTag);
                return newState;
              });
              setNewPeopleTag("");
            }}
          >
            <input
              type="text"
              className="block !py-0 !px-0 !text-sm !border-none !border-gray-500 !bg-transparent"
              placeholder="new tag..."
              value={newPeopleTag}
              onChange={(e) => setNewPeopleTag(e.target.value)}
            />
            <button className="-mb-1" type="submit">
              <span className="material-symbols-outlined leading-none text-mainAccent">
                add
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

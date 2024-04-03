// This file contains all the configurations ragarding backend

const contentsAddress = "http://127.0.0.1:9000/";
export const contentServer = {
  urls: {
    root: contentsAddress,
    users: `${contentsAddress}/users/`,
  },
};

// Simple backend
const simpleBackendServerURL = "http://127.0.0.1:5500";

export const simpleBackend = {
  urls: {
    root: simpleBackendServerURL,
    signup: `${simpleBackendServerURL}/user/signup`,
    signUpVerify: `${simpleBackendServerURL}/user/signup/verify`,
    login: `${simpleBackendServerURL}/user/login`,
    verifyToken: `${simpleBackendServerURL}/user/verifyToken`,
    allOrgs: `${simpleBackendServerURL}/user/organization/all`,
    createOrg: `${simpleBackendServerURL}/user/organization`,
    deleteOrg: `${simpleBackendServerURL}/user/organization/delete`,
    orgRequestCode: `${simpleBackendServerURL}/user/organization/code`,
    createBucket: `${simpleBackendServerURL}/media/bucket/create`,
    allBuckets: `${simpleBackendServerURL}/media/bucket/all`,
  },
};

// Tagging engine
const taggingEngineServerURL = "http://127.0.0.1:5501";
export const taggingEngine = {
  handlers: { sendImagesToEngine: null, askTags: null },
  urls: {
    tagImage: `${taggingEngineServerURL}/image/save`,
    askTags: `${taggingEngineServerURL}/image/askTags`,
    ackFaces: `${taggingEngineServerURL}/image/askTags/facial`,
    ragisterMediaItems: `${taggingEngineServerURL}/image/recognize`,
  },
};

// Image tagging handler
async function sendImagesToEngine(imageFiles, token) {
  // Create a FormData object to hold the files
  const formData = new FormData();

  // Append each selected file to the FormData object
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append("files", imageFiles[i]);
  }
  // Make a Fetch API request to send files to the server
  const res = await fetch(taggingEngine.urls.tagImage, {
    method: "POST",
    headers: { Authorization: token },
    body: formData,
  });
  if (res.ok) {
    const resObj = await res.json();
    return resObj;
  } else {
    throw new Error();
  }
}

// ask for tags suggestions of any already uploaded file
async function askTags(filenames, bucketName, token, algo = "RESNET") {
  const res = await fetch(taggingEngine.urls.askTags, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ filenames, bucketName, algo }),
  });
  if (res.ok) {
    const resObj = await res.json();
    return resObj;
  } else {
    throw new Error();
  }
}

// ask for tags suggestions of any already uploaded file
async function askFacialTags(filenames, bucketName, token) {
  const res = await fetch(taggingEngine.urls.ackFaces, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ filenames, bucketName }),
  });
  if (res.ok) {
    const resObj = await res.json();
    return resObj;
  } else {
    throw new Error();
  }
}

// recognize media items
async function recognizeMediaItems(mediaNames, bucketName, token, tagsObj) {
  const res = await fetch(taggingEngine.urls.ragisterMediaItems, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      bucketName: bucketName,
      mediaNames: mediaNames,
      tags: tagsObj,
    }),
  });
  if (res.ok) {
    const resObj = await res.json();
    return resObj;
  } else {
    throw new Error();
  }
}

taggingEngine.handlers.sendImagesToEngine = sendImagesToEngine;
taggingEngine.handlers.askTags = askTags;
taggingEngine.handlers.askFacialTags = askFacialTags;
taggingEngine.handlers.recognizeMediaItems = recognizeMediaItems;

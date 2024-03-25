// This file contains all the configurations ragarding backend

const contentsAddress = "http://127.0.0.1:9000/";
export const contentServer = {
  urls: {
    root: contentsAddress,
    users: `${contentsAddress}/users/`,
  },
};

const simpleBackendServerURL = "http://127.0.0.1:5500";
export const simpleBackend = {
  urls: {
    root: simpleBackendServerURL,
    signup: `${simpleBackendServerURL}/user/signup`,
    signUpVerify: `${simpleBackendServerURL}/user/signup/verify`,
    login: `${simpleBackendServerURL}/user/login`,
  },
};

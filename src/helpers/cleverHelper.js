const axios = require("axios");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const accessTokenSecret = config.jwt.access_token;

class CleverError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.status = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const requestClever = async (route, token) => {
  try {
    const url = `https://api.clever.com/v3.0${route}`;

    const response = await axios.get(url, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    let message = "something wrong";
    const { status } = error.response;
    if (status === 401) {
      message = "You don't have permession!";
    } else if (status === 404){
      message = "not-found";
    }
    else if (status === 429 || status === 500 || status === 502 || status === 503) {
      message = "Something wrong try later!";
    } else if (status === 501) {
      message = "not supported";
    }

    throw new CleverError(message, status);
  }
};

const getIdentity = async (token) => {
  const response = await requestClever("/me", token);
  return response.data;
};

const getUserById = async (userId, userType, token) => {
  const route = `/${userType}s/${userId}`;
  const response = await requestClever(route, token);

  return response.data;
};

module.exports = {
  getIdentity,
  getUserById,
  getRediectSecret: (cleverRole) => {
    const expiresIn = "2m";

    const accessToken = jwt.sign({ cleverRole }, accessTokenSecret, {
      expiresIn: expiresIn,
    });
    return accessToken;
  },
  verifyRediectSecret: async (token) => {
    try {
      const user = await jwt.verify(token, accessTokenSecret);

      return { user };
    } catch (err) {
      return { error: err };
    }
  },
  getSectionsByTeacher: async (cleverId, token) => {
    const route = `/users/${cleverId}/sections`;
    const response = await requestClever(route, token);

    return response.data;
  },
  getMyStudents: async (cleverId, token) => {
    const route = `/users/${cleverId}/mystudents`;
    const response = await requestClever(route, token);

    return response.data;
  },
  CleverError,
};

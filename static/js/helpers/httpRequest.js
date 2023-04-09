import axios from "axios";

const postData = async (url, postObject, accessToken) => {
  let requestData = Object.assign({}, postObject);
  return await axios({
    method: "post",
    url: url,
    data: requestData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "Application/json",
    },
  });
};

const getData = async (url, params, accessToken) => {
  return axios.get(url, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "Application/json",
    },
  });
};

const putRecord = async (url, params, accessToken) => {
  return axios({
    method: "PUT",
    url,
    data: params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "Application/json",
    },
  });
};

export { postData, getData, putRecord };

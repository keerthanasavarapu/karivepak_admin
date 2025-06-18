import axios from "axios";
import useAuth from "../context/hooks/useAuth";
import * as Storage from "../store/LocalStorage";

export default function FetchServices() {
  let { user } = useAuth();

  const isNotAuthorized = (status) => {
    if (status === 401) {
      Storage.remove(Storage.localStorageKey);
      window.location.reload();
    }
  };

  const AxiosServices = {
    AxiosService: function ({
      API,
      payload,
      authNeeded = true,
      type,
      token:accessToken
    }) {
      let authData = {};
      if (authNeeded) {
        authData = {
          token: user?.token ?? accessToken,
        };
      }
      let header = {
        "content-type": "application/json",
        Authorization: authData.token,
      };
      return axios({
        method: type,
        url: API,
        headers: header,
        params:
          type === "GET" || type === "DELETE"
            ? {
                ...payload,
              }
            : {},
        data: payload,
      })
        .then(function (response) {
          var resData = response.data;
          let headers = response.headers;
          let token = headers["token"] && headers["token"];
          if (!resData) {
            return {
              status: false,
              success: true,
              data: {},
              ...(token ? { token } : {}),
            };
          }
      const apiResponse = resData?.data || "";
          return {
            status: true,
            data: apiResponse,
            success: true,
            ...(token ? { token } : {}),
          };
        })
        .catch(function (res) {
          let data = res?.response || {};
          let status = data.status;
          isNotAuthorized(status);
          return {
            status: false,
            success: false,
            message: res?.message,
            ...res?.response?.data,
          };
        });
    },
  };
  return AxiosServices;
}

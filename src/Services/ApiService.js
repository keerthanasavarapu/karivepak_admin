import endPoints from "./EndPoints";
import FetchServices from "./ResponseService";

export default function ApiServices() {
  const { AxiosService } = FetchServices();
  const baseUrl = "http://localhost:9000/api/";
  const adminEndPoint = "http://localhost:9000/api";
  const productEndPoint = "http://localhost:3000/v1/products";
  const apiFunctions = {

    // Store API 

    // getAllStores: function () {
    //   let API = baseUrl + endPoints.getAllStores;
    //   let type = "GET";
    //   return AxiosService({ API, payload, authNeed: false, type }).then(
    //     (res) => {
    //       return res;
    //     }
    //   );
    // },

    // getSubCategoriesByCategory: function (details, categoryId) {
    //   let API = adminEnpoint + endPoints.getSubCategoriesByCategory + "/" + categoryId;

    //   let payload = {
    //     ...details,
    //   };
    //   let type = "GET";
    //   return AxiosService({ API, payload, authNeed: false, type }).then(
    //     (res) => {
    //       return res;
    //     }
    //   );
    // },

    // getProducts: function (details) {
    //   let API = productEndPoint + endPoints.getProducts;

    //   let payload = {
    //     ...details,
    //   };
    //   let type = "GET";
    //   return AxiosService({ API, payload, authNeed: false, type }).then(
    //     (res) => {
    //       return res;
    //     }
    //   );
    // },

    addBrand: async function (details) {
      let API = adminEndPoint + endPoints.addBrand;

      let payload = {
        ...details,
      };

      let type = "POST";
      const res = await AxiosService({ API, payload, authNeed: true, type });
      return res;
    },

    getBrandList: async function () {
      let API = adminEndPoint + endPoints.getBrandList;
      let payload = {};
      let type = "GET";
      const res = await AxiosService({ API, payload, authNeed: true, type });
      return res;
    }

    


  };

  return apiFunctions;
}

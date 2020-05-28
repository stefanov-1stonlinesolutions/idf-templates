import axios from "axios";
import Axios from "axios";

let request;

export const createAPI = baseURL => {
  request = axiod.create({
    baseURL: apiURL,
    withCredentials: true
  });
};

export default {
  getTemplates: () => request("/templates"),
  getRules: template_id => request(`/templates/${template_id}/rules`)
};

import axios from "axios";
import Axios from "axios";

let request;

export const createAPI = baseURL => {
  request = axios.create({
    baseURL: baseURL,
    withCredentials: true
  });
};

export default {
  getVersions:  async ()          => (await request("/versions")).data.data,
  getTemplates: async idf_version => (await request(`/templates/version/${idf_version}`)).data.data,
  getLibrary:   async idf_version => (await request(`/libraries/${idf_version}`) ).data.data,
  createTemplate: async data      => (await request.post(`/templates`, data) ).data.data,
  getClasses:   async template_id => (await request(`/templates/${template_id}/class-list`) ).data.data,
  getRules: async template_id     => (await request(`templates/${template_id}/rules`) ).data.data,
  getObjects: async ids           => (await request(`templates/${ids}/rules`) ).data.data,
  getRelatedClasses: async (class_name, template_id) => (await request(`/templates/${template_id}/get-refs/${class_name}`) ).data.data,
  
  getLibraryObjects: async (library_id, class_name) => ( await request(`/idf-documents/${library_id}/classes/${class_name}/objects`) ).data.data,

  getSecondaryCondition: async (class_name, template_id) => (await request(`/templates/${template_id}/secondary-condition/${class_name}`)).data.data,


  createTemplateRule: async (template_id, rule_data) => ( await request.post(`/templates/${template_id}/rules`, rule_data) )
  // getRules: template_id => request(`/templates/${template_id}/rules`)
};

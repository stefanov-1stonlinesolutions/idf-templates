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
  getRules:     async template_id     => (await request(`templates/${template_id}/rules`) ).data.data,
  getObjects: async ids           => (await request(`templates/${ids}/rules`) ).data.data,
  getRelatedClasses: async (class_name, template_id) => (await request(`/templates/${template_id}/get-refs/${class_name}`) ).data.data,
  
  getLibraryObjects: async (library_id, class_name) => ( await request(`/idf-documents/${library_id}/classes/${class_name}/objects`) ).data.data,

  getSecondaryCondition: async (class_name, template_id) => (await request(`/templates/${template_id}/secondary-condition/${class_name}`)).data.data,

  createTemplateRule: async (template_id, rule_data) => ( await request.post(`/templates/${template_id}/rules`, rule_data) ).data.data,

  duplicateTemplate: async (template_id) => (await request.post(`/templates/${template_id}/duplicate`)).data.data,

  deleteTemplate: async (template_id) => (await request.delete(`/templates/${template_id}`)).data,

  getAllObjects: async (library_id) => (await request.post(`/idf-documents/${library_id}/get-objects-by-class-list`, {class_names: []})).data.data,

  getObjectsByIds: async (library_id, ids) => (await request.post(`/idf-documents/${library_id}/get-objects-by-id`, {ids})).data.data,

  deleteRule: async (template_id, rule_id) => ( await request.delete(`/templates/${template_id}/rules/${rule_id}`) ).data,

  updateRule: async rule => ( await request.put(`/templates/${rule.template_id}/rules/${rule.id}`, rule) ).data.data,

  getIDDClass: async (doc_id, class_name) => (await request(`/idf-documents/${doc_id}/classes/${class_name}`)).data.data

};

import axios from 'axios';

import { requestInterceptor, errorInterceptor } from './interceptors/api.interceptors';

class ApiServices {
  constructor() {
    this.api = axios.create({});

    // Permite configurar o request ANTES dele ser feito
    this.api.interceptors.request.use(requestInterceptor);

    // Permite acessar e tratar o response ou o error (se ocorrer) antes de ocorrerem
    this.api.interceptors.response.use(
      response => response,
      errorInterceptor,
    );
  }

  getAllBanks = async() => {
    const { data } = await this.api.get(`${process.env.REACT_APP_API_BASE_URL}/bank/private/list`);
    return data;
  }

  getMyPix = async () => {
    const { data } = await this.api.get(`${process.env.REACT_APP_API_BASE_URL}/pix/private/list?type=1`);

    return data;
  }

  get3PPix = async () => {
    const { data } = await this.api.get(`${process.env.REACT_APP_API_BASE_URL}/pix/private/list?type=2`);

    return data;
  }

  getOnePixById = async id => {
    const { data } = await this.api.get(`${process.env.REACT_APP_API_BASE_URL}/pix/private/list/${id}`);

    return data;
  }

  deletePixById = async id => {
    await this.api.delete(`${process.env.REACT_APP_API_BASE_URL}/pix/private/delete/${id}`);
  }

  createPix = async data => {
    await this.api.post(`${process.env.REACT_APP_API_BASE_URL}/pix/private/create`, data);
  }

  editPixById = async (id, data) => {
    await this.api.put(`${process.env.REACT_APP_API_BASE_URL}/pix/private/update/${id}`, data);
  }

}

export default new ApiServices();

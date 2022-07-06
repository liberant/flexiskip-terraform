/**
 * Http client module to perform ajax request
 * All source codes in application will use this module instead of calling axios directly
 */

import axios from "axios";
import * as params from "./constants/params";

const httpGetAddressGCC = axios.create({
  baseURL: process.env.API_URL_GCC_ADDRESS,
  timeout: params.REQUEST_TIMEOUT,
  headers: {},
});

export default httpGetAddressGCC;

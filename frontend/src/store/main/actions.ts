import { AppThunk } from "../index";
import {
  MainActionTypes,
  GET_BUCKETS_START,
  GET_BUCKETS_SUCCESS,
} from "./types";
import { Bucket } from "../../models";
import { getBucketsRequest } from "../../api";
import { setErrorAction } from '../error';

export function getBucketsStart(): MainActionTypes {
  return {
    type: GET_BUCKETS_START,
  };
}

export function getBucketsSuccess(buckets: Bucket[]): MainActionTypes {
  return {
    type: GET_BUCKETS_SUCCESS,
    buckets,
  };
}

export const getBuckets = (): AppThunk => (dispatch) => {
  dispatch(getBucketsStart());
  return getBucketsRequest()
    .then((response) => dispatch(getBucketsSuccess(response.data.results)))
    .catch((error) => dispatch(setErrorAction(error)));
};

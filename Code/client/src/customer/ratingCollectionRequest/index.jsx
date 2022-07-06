import { Button } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "../../common/components/Spinner";
import httpClient from "../../common/http";
import "./style.css";

const RatingCollectionRequest = (props) => {
  const { id } = props.match.params;
  const { history } = props;

  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");

  const getCollectionInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await httpClient.get(`/collection-requests/${id}`);
      if (!data) history.push("/");
    } catch (error) {
      const { message } = error.response.data;
      alert(message);
      history.push("/");
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmitForm = async () => {
    try {
      if (!rate) return;
      setLoading(true);

      await httpClient.post(
        `/collection-requests/${id}/rating`,
        {
          rate,
          comment,
        }
      );
      alert("Successfully! Thank you for your rating!");
      history.push("/");
    } catch (error) {
      const { message } = error.response.data;
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCollectionInfo();
  }, []);

  return (
    <div>
      {loading && <Spinner />}
      <div className="container">
        <h1>Give your review here</h1>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((number) => {
            const isYellowStar = rate >= number;
            return (
              <i
                onClick={() => setRate(number)}
                key={number}
                className={`${isYellowStar ? "fa fa-star" : "fa fa-star-o"
                  }`}
              />
            );
          })}
        </div>
        <div>
          <textarea
            onChange={(e) => setComment(e.target.value)}
            className="form-control"
            rows="5"
            placeholder="Write your review here"
          ></textarea>
        </div>
        <Button
          type="primary"
          className="btn-submit"
          onClick={onSubmitForm}
          disabled={!rate}
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default RatingCollectionRequest;

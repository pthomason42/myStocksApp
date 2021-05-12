import axios from 'axios';

// define api related actions
const fetchData = () => ({
    type: "API_PENDING",
});

const fetchSuccess = (data) => ({
    type: "API_SUCCESS",
    payload: data,
});

const fetchError = (error) => ({
    type: "API_ERROR",
    payload: error,
});

//wrap them all up in one function. 
const apiCall = (url) => (dispatch) => {
    console.log('apiCall');
  dispatch(fetchData());
  return new Promise(() => {
    axios
      .get(url)
      .then((response) => {
        dispatch(fetchSuccess(response.data));
          console.log('apiCallSuccess: ' + JSON.stringify(response.data))
      })
      .catch((error) => {
        dispatch(fetchError(error));
        console.log(error);
      });
  });
};

const doSomething = () => { console.log('doSomething')};

export { apiCall, doSomething };

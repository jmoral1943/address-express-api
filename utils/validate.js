const axios = require("axios");

const validate = req => {
  return (
    axios
      .get("http://www.groupkt.com/country/get/all")
      .then(({ data }) => {
        let country;
        if (req.query.country) {
          country = data.RestResponse.result.find(
            country =>
              req.query.country.toLowerCase() === country.name.toLowerCase()
          );
        } else {
          country = data.RestResponse.result.find(
            country =>
              req.body.country.toLowerCase() === country.name.toLowerCase()
          );
        }

        if (!country)
          throw new Error(
            "The country is not a valid country or not the entire name"
          );

        return country.alpha3_code;
      })
      // second axios request to validate the state is actually in that country
      .then(country => {
        let url = `http://www.groupkt.com/state/get/${country}/all`;
        return axios.get(url).then(({ data }) => {
          let state;
          if (req.query.state) {
            state = data.RestResponse.result.find(
              state =>
                req.query.state.toLowerCase() === state.name.toLowerCase()
            );
          } else {
            state = data.RestResponse.result.find(
              state => req.body.state.toLowerCase() === state.name.toLowerCase()
            );
          }

          if (!state)
            throw new Error(
              `The state is not a valid state in ${country} or you did not put the entire name`
            );
        });
      })
  );
};

module.exports = validate;

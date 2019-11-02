const expect = require("chai").expect;
const request = require("request");
const port = process.env.PORT || 3000;

describe("Validating the state and country", () => {
  it("GET - Querying with wrong country", done => {
    request.get(
      {
        url: `http://localhost:${port}/address?country=united%20states%20of%20ame&state=new%20york`
      },
      (err, httpResponse, body) => {
        expect(body).to.equal(
          "Error: The country is not a valid country or not the entire name"
        );
        console.log(body);
        done();
      }
    );
  });

  it("GET - Querying with wrong state", done => {
    request.get(
      {
        url: `http://localhost:${port}/address?country=united%20states%20of%20america&state=new%20yor`
      },
      (err, httpResponse, body) => {
        expect(body).to.equal(
          "Error: The state is not a valid state in USA or you did not put the entire name"
        );
        console.log(body);
        done();
      }
    );
  });

  it("POST - Posting data with wrong country name", done => {
    request.post(
      {
        url: `http://localhost:${port}/address`,
        form: {
          name: "jeff",
          street: "10109 Here Isand drive",
          city: "new york",
          state: "new york",
          country: "United States of Americ"
        }
      },
      (err, httpResponse, body) => {
        expect(body).to.equal(
          "Error: The country is not a valid country or not the entire name"
        );
        console.log(body);
        done();
      }
    );
  });

  it("POST - Posting data with wrong state name", done => {
    request.post(
      {
        url: `http://localhost:${port}/address`,
        form: {
          name: "jeff",
          street: "10109 Here Isand drive",
          city: "new york",
          state: "new yor",
          country: "United States of America"
        }
      },
      (err, httpResponse, body) => {
        expect(body).to.equal(
          "Error: The state is not a valid state in USA or you did not put the entire name"
        );
        console.log(body);
        done();
      }
    );
  });

  it("PUT - Puting data with wrong country name", done => {
    request.put(
      {
        url: `http://localhost:${port}/address/110`,
        form: {
          name: "jeff",
          street: "10109 Here Isand drive",
          city: "new york",
          state: "new york",
          country: "United States of Americ"
        }
      },
      (err, httpResponse, body) => {
        expect(body).to.equal(
          "Error: The country is not a valid country or not the entire name"
        );
        console.log(body);
        done();
      }
    );
  });

  it("PUT - Puting data with wrong state name", done => {
    request.put(
      {
        url: `http://localhost:${port}/address/110`,
        form: {
          name: "jeff",
          street: "10109 Here Isand drive",
          city: "new york",
          state: "new yor",
          country: "United States of America"
        }
      },
      (err, httpResponse, body) => {
        expect(body).to.equal(
          "Error: The state is not a valid state in USA or you did not put the entire name"
        );
        console.log(body);
        done();
      }
    );
  });

  it("PUT - Puting data with wrong id", done => {
    request.put(
      {
        url: `http://localhost:${port}/address/84934`,
        form: {
          name: "jeff",
          street: "10109 Here Isand drive",
          city: "new york",
          state: "new york",
          country: "United States of America"
        }
      },
      (err, httpResponse, body) => {
        expect(body).to.equal("There is no address with that Id");
        console.log(body);
        done();
      }
    );
  });
});

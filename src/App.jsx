import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./App.css";
import img from "./logo.svg";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [], //Master array
      finalUsers: [],
      hasMore: true,
    };
  }
  componentDidMount() {
    this.fetchMoreData();
  }
  //Fetching data at once of 500 users
  fetchMoreData = async () => {
    const res = await fetch("https://randomuser.me/api/?results=500");
    const json = await res.json();
    res.status === 200 &&
      this.setState(
        {
          ...this.state.users,
          users: [...json.results],
        },
        () => {
          this.insertMore();
          // console.log(this.state.users, "users");
        }
      );
  };

  //Pushing 5 users to new array from master array
  insertMore = () => {
    const { users, finalUsers } = this.state;
    let lastIndex = finalUsers.length;
    let current = 0;
    let hasNext = true;
    let remainingItems = [];
    finalUsers.length === users.length &&
      this.setState({ ...this.state, hasMore: false });
    if (finalUsers.length < users.length) {
      if (lastIndex <= 0) {
        let array = [];
        for (let i = 0; i < 5; i++) {
          // finalUsers = [...finalUsers, user[i]]
          array.push(users[i]);
        }
        this.setState({ ...finalUsers, finalUsers: array });
      } else {
        current = finalUsers.indexOf(finalUsers[lastIndex - 1]) + 1;
        hasNext = users[current + 4] || false;
        if (hasNext) {
          let array = [];
          for (let i = 0; i < 5; i++) {
            // finalUsers = [...finalUsers, users[current + i]]
            array.push(users[current + i]);
          }
          this.setState({
            ...finalUsers,
            finalUsers: finalUsers.concat(array),
          });
        } else {
          remainingItems = users.slice(current);
          // finalUsers = [...finalUsers, ...remainingItems]
          this.setState({
            ...this.state,
            finalUsers: finalUsers.concat(remainingItems),
            hasMore: false,
          });
        }
      }
    } else return false;
  };
  render() {
    const { finalUsers } = this.state;
    const cards =
      finalUsers &&
      finalUsers.map((item, i) => {
        return (
          <div className="card m-3 col-lg-2 p-0" key={i}>
            <div className="card-body">
              <img src={item.picture.large} alt="" />
            </div>
          </div>
        );
      });
    return (
      <div className="App">
        <header className="App-header">
          <div className="container">
            <h1>Infinite Scroll without pagination in api</h1>
            <h3>Fetching 500 users data at once and showing them on scroll</h3>
            <img src={img} alt="react_logo" style={{ width: "8%" }} />
            <p>
              <small>
                <em>dev@subhom</em>
              </small>
            </p>
            <i className="fas fa-long-arrow-alt-down fa-2x bounce"></i>
          </div>
        </header>
        <div className="container">
          <InfiniteScroll
            dataLength={finalUsers.length}
            next={this.insertMore}
            hasMore={this.state.hasMore}
            loader={<h4>Loading...</h4>}
            className="row justify-content-center"
          >
            {cards}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default App;

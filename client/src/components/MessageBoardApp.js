import React from "react";
import "../css/MessageBoardApp.css";
import axios from "axios";
import CommentList from "./CommentList";
import SearchCommentList from "./SearchCommentList";
import AddCommentForm from "./AddCommentForm";

class MessageBoardApp extends React.Component {
  constructor(props) {
    super(props);

    // set initial state
    this.state = {
      comments: []
    };
  }

  // lifecycle hook ran after component is loaded into DOM
  componentDidMount() {
    axios
      .get("https://express-train.herokuapp.com/api/comments")
      .then(response => this.setState({ comments: response.data }));
  }

  handleDelete = (id) => {
    axios
      .delete(`https://express-train.herokuapp.com/api/comments/${id}`)
      .then(response => this.setState({ comments: response.data.comments }))
      .catch(error => console.error(error));
    // // filter out the comments
    // const updatedComments = this.state.comments.filter(
    //   comment => comment.id !== id
    // );
    // // set state
    // this.setState({ comments: updatedComments });
  };

  handleAddComment = (commentText) => {
    console.log(`commenting ${commentText}`);
    axios
      .post(`https://express-train.herokuapp.com/api/comments/`, {
        text: commentText
      })
      .then(response => this.setState({ comments: response.data.comments }))
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert("Please enter comment text");
        }
      });
  };

  handleSearchCommentList = (searchText) => {
    console.log("Searching...");
    console.log(searchText);
    axios
      .get(
        `https://express-train.herokuapp.com/api/comments/?filter=${searchText}`
      )
      .then(response => this.setState({ comments: response.data }));
  };

  render() {
    return (
      <div className="message-board-app">
        <nav>
          <SearchCommentList
            onSearchCommentList={this.handleSearchCommentList}
          />
          <button type="button" id="nukeButton">
            Nuke all Comments
          </button>
        </nav>
        <CommentList
          comments={this.state.comments}
          onDelete={this.handleDelete}
        />
        <AddCommentForm onAddComment={this.handleAddComment} />
      </div>
    );
  }
}

export default MessageBoardApp;

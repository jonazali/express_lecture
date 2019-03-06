import React from "react";
import "../css/MessageBoardApp.css";
import CommentList from "./CommentList";
import CommentItem from "./CommentItem";
import commentData from "../data";

class MessageBoardApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: commentData
    };
  }

  handleDelete = (id) => {
    // filter out the comments
    const updatedComments = this.state.comments.filter(
      comment => comment.id !== id
    );
    // set state
    this.setState({ comments: updatedComments });
  };

  render() {
    return (
      <div className="message-board-app">
        <nav>
          <form>
            <input type="text" name="search" placeholder="Search" />
            <button type="submit">Search</button>
          </form>
          <button type="button" id="nukeButton">
            Nuke all Comments
          </button>
        </nav>
        <CommentList
          comments={this.state.comments}
          onDelete={id => this.handleDelete(id)}
        />
        <div className="add-comment">
          <form>
            <input type="text" name="comment" placeholder="Your opinion here" />
            <button type="submit">Comment</button>
          </form>
        </div>
      </div>
    );
  }
}

export default MessageBoardApp;

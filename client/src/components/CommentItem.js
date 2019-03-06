import React from "react";
import "../css/CommentItem.css";

class CommentItem extends React.Component {
  render() {
    const { comment, onDeleteMe } = this.props;
    return (
      <div className="message-board-comment-item">
        <p>{comment.text}</p>
        <button type="button" className="delete-button" onClick={onDeleteMe}>
          x
        </button>
      </div>
    );
  }
}

export default CommentItem;

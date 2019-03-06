import React from "react";
import "../css/CommentList.css";
import CommentItem from "./CommentItem";

class CommentList extends React.Component {
  render() {
    const { comments, onDelete } = this.props;

    return (
      <div className="message-board-comment-list">
        {/* foreach does not return anything, map function returns array */}
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDeleteMe={() => onDelete(comment.id)}
          />
        ))}
      </div>
    );
  }
}

export default CommentList;

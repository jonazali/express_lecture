import React from "react";

class SearchCommentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { searchTextValue: "" };
  }

  handleChange = (event) => {
    this.setState({ searchTextValue: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearchCommentList(this.state.searchTextValue);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="comment"
          placeholder="Type something!"
          value={this.state.searchTextValue}
          onChange={this.handleChange}
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}

export default SearchCommentList;

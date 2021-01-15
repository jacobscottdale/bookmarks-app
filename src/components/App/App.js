import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from 'routes/AddBookmark/AddBookmark';
import UpdateBookmark from 'routes/UpdateBookmark/UpdateBookmark';
import BookmarkList from 'routes/BookmarkList/BookmarkList';
import Nav from 'components/Nav/Nav';
import BookmarksContext from 'BookmarksContext';
import config from 'config';
import 'components/App/App.css';

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    });
  };

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark],
    });
  };

  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
    this.setState({
      bookmarks: newBookmarks
    });
  };

  updateBookmark = updatedBookmark => {
    this.setState({
      bookmarks: this.state.bookmarks.map(bookmark =>
        (bookmark.id !== updatedBookmark.id) ? bookmark : updatedBookmark)
    });
  };

  componentDidMount() {
    console.log(config.REACT_APP_API_KEY)
    fetch(config.REACT_APP_API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.REACT_APP_API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error));
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }));
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark,
    };

    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
            <Route
              exact
              path='/'
              component={BookmarkList}
            />
            <Route
              path='/add-bookmark'
              component={AddBookmark}
            />
            <Route
              path='/update/:bookmarkId'
              component={UpdateBookmark}
            />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;

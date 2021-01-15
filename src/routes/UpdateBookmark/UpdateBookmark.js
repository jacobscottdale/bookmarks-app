import React, { Component } from 'react'
import BookmarksContext from 'BookmarksContext'
import config from 'config'
import 'routes/UpdateBookmark/UpdateBookmark.css'

const Required = () => (
  <span className='UpdateBookmark__required'>*</span>
)

export default class UpdateBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
    error: null,
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params
    fetch(config.REACT_APP_API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'authorization': `bearer ${config.REACT_APP_API_KEY}`
      }
    })
    .then(res => {
      if (!res.ok)
        return res.json().then(error => Promise.reject(error))
      return res.json()
    })
    .then(data => {
      this.setState({
        id: data.id,
        title: data.title,
        url: data.url,
        description: data.description,
        rating: data.rating
      })
    })
    .catch(error => {
      this.setState({ error })
    })
  }

  resetFields = newFields => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || 1,
    })
  }

  handleChangeTitle = e => {
    this.setState({ title: e.target.value })
  }

  handleChangeDescription = e => {
    this.setState({ description: e.target.value })
  }

  handleChangeUrl = e => {
    this.setState({ url: e.target.value })
  }

  handleChangeRating = e => {
    this.setState({ rating: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { bookmarkId } = this.props.match.params
    const { id, title, url, description, rating } = this.state;
    const newBookmark = {
      id,
      title,
      url,
      description,
      rating,
    };
    this.setState({ error: null });
    fetch(config.REACT_APP_API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.REACT_APP_API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error));
        }
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark);
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  handleClickCancel = () => {
    this.props.history.push('/')
  }

  render() {
    const { error, title, url, description, rating } = this.state;
    return (
      <section className='UpdateBookmark'>
        <h2>Update bookmark</h2>
        <form
          className='UpdateBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='UpdateBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
              value={title}
              onChange={this.handleChangeTitle}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              required
              value={url}
              onChange={this.handleChangeUrl}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              required
              value={rating}
              onChange={this.handleChangeRating}
            />
          </div>
          <div className='UpdateBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}
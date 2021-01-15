import React from 'react';
import { Link } from 'react-router-dom';
import BookmarksContext from 'BookmarksContext';
import Rating from 'components/Rating/Rating';
import config from 'config';
import 'components/BookmarkItem/BookmarkItem.css';

function deleteBookmarkRequest(bookmarkId, callback) {
  fetch(`${config.REACT_APP_API_ENDPOINT}/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${config.REACT_APP_API_KEY}`
    }
  })
    .then(res => {
      if (!res.ok)
        return res.json().then(error => Promise.reject(error));

    })
    .then(() => callback(bookmarkId))
    .catch(error => console.log(error));
}

export default function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {(context) => (
      <li className='BookmarkItem'>
        <div className='BookmarkItem__row'>
          <h3 className='BookmarkItem__title'>
            <a
              href={props.url}
              target='_blank'
              rel='noopener noreferrer'>
              {props.title}
            </a>
          </h3>
          <Rating value={props.rating} />
        </div>
        <p className='BookmarkItem__description'>
          {props.description}
        </p>
        <div className='BookmarkItem__buttons'>
          <Link to={`/update/${props.id}`}>
            Update
          </Link>
          {' '}
          <button
            className='BookmarkItem__description'
            onClick={() => deleteBookmarkRequest(props.id, context.deleteBookmark)}
          >
            Delete
        </button>
        </div>
      </li>
      )}
    </BookmarksContext.Consumer>

  );
}

BookmarkItem.defaultProps = {
  onClickDelete: () => { },
};

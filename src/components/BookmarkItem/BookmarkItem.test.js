import React from 'react';
import ReactDOM from 'react-dom';
import BookmarkItem from 'components/BookmarkItem/BookmarkItem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BookmarkItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});

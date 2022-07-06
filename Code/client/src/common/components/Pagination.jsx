import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Display a pagination in bootstrap style
 */
export default class Pagination extends Component {
  static range(min, max, step = 1) {
    const result = [];
    if (!max) return result;
    for (let i = min; i <= max; i += step) {
      result.push(i);
    }
    return result;
  }

  onClick = (page) => {
    this.props.onChange(page);
  }

  renderFirst() {
    return (this.props.page > 1 &&
      <li>
        <a role="button" onClick={() => this.onClick(1)} href="#first">
          <span className="glyphicon glyphicon-step-backward" aria-hidden="true" />
        </a>
      </li>
    );
  }

  renderPrevious() {
    const { page } = this.props;
    return (page > 1 &&
      <li>
        <a role="button" onClick={() => this.onClick(page - 1)} href="#previous">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
        </a>
      </li>
    );
  }

  renderNext() {
    const { page, pageCount } = this.props;
    return (page < pageCount &&
      <li>
        <a role="button" onClick={() => this.onClick(page + 1)} href="#next">
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true" />
        </a>
      </li>);
  }

  renderLast() {
    const { page, pageCount } = this.props;
    return ((page < pageCount) && (
      <li>
        <a role="button" onClick={() => this.onClick(pageCount)} href="#last">
          <span className="glyphicon glyphicon-step-forward" aria-hidden="true" />
        </a>
      </li>
    ));
  }

  renderItem(page) {
    return (
      <li key={page} className={page === this.props.page ? 'active' : ''}>
        <a role="button" onClick={() => this.onClick(page)} href="#button">{page}</a>
      </li>
    );
  }

  renderItems() {
    const { page: current, pageCount: total } = this.props;
    const range = 3;
    return Pagination.range(Math.max(current - range, 1), Math.min(current + range, total))
      .map(item => this.renderItem(item));
  }

  render() {
    return (this.props.pageCount > 1 &&
      <ul className="pagination pagination-sm">
        {this.renderFirst()}
        {this.renderPrevious()}
        {this.renderItems()}
        {this.renderNext()}
        {this.renderLast()}
      </ul>
    );
  }
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

import React from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../store/slices/userSlice';
import Spinner from '../Spinner/Spinner';
import { Redirect } from 'react-router-dom';

const PrivateHoc = (Component, props) => {
  class Hoc extends React.Component {
    componentDidMount () {
      if (!this.props.data) {
        this.props.getUser();
      }
    }

    render () {
      if (this.props.isFetching) {
        return <Spinner />;
      }

      if (!this.props.data) {
        return <Redirect to='/login' replace />;
      }

      if (props.requiredRole && this.props.data.role !== props.requiredRole) {
        return <Redirect to='/' replace />;
      }

      return (
        <Component
          history={this.props.history}
          match={this.props.match}
          {...props}
        />
      );
    }
  }

  const mapStateToProps = state => state.userStore;

  const mapDispatchToProps = dispatch => ({
    getUser: () => dispatch(getUser()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Hoc);
};

export default PrivateHoc;

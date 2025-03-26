import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Chat from '../Chat/Chat';
import { setUserId } from '../../../../store/slices/chatSlice';

const ChatContainer = props => {
  const { data, setUserId } = props;

  useEffect(() => {
    if (data?.id) {
      setUserId(data.id);
    }
  }, [data?.id, setUserId]);

  return <>{data ? <Chat /> : null}</>;
};

const mapStateToProps = state => {
  const { data } = state.userStore;
  return { data };
};

const mapDispatchToProps = {
  setUserId,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);

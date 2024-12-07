import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HowItWorks from '../../components/HowItWorks/HowItWorks';

class HowItWorksPage extends Component {
  render () {
    return (
      <>
        <Header />
        <HowItWorks />
        <Footer />
      </>
    );
  }
}

export default HowItWorksPage;

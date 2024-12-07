import React, { Component } from 'react';
import styles from './HowItWorks.module.sass';
class HowItWorks extends Component {
  render () {
    return (
      <section>
        <div className={styles.hhInner}>
          <div className={styles.content}>
            <div className={styles.container}>
              <div className={styles.flex}>
                <div className={styles.left}>
                  <h4>World's #1 Naming Platform</h4>
                  <h1>How Does Atom Work?</h1>
                  <p>
                    Atom helps you come up with a great name for your business
                    by combining the power of crowdsourcing with sophisticated
                    technology and Agency-level validation services.
                  </p>
                </div>
                <div className={styles.right}>
                  <div className={styles.videoBox}>
                    <iframe
                      src='https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362?autoplay=false&amp;loop=false&amp;muted=false&amp;preload=true&amp;responsive=true'
                      allow='accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;'
                      allowfullscreen='true'
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default HowItWorks;

import React, { Component } from 'react';
import { LiaLongArrowAltRightSolid } from 'react-icons/lia';
import styles from './HowItWorks.module.sass';
class HowItWorks extends Component {
  render () {
    return (
      <>
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
                        allowFullScreen={true}
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className={styles.hhInner}>
            <div className={styles.homeBlock}>
              <div className={styles.container}>
                <div className={styles.hbCaption}>
                  <div className={styles.max500}>
                    <span>Our Services</span>
                    <h2>3 Ways To Use Atom</h2>
                    <p>
                      Atom offers 3 ways to get you a perfect name for your
                      business.
                    </p>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.colCard}>
                    <div className={`${styles.item} ${styles.alignBox}`}>
                      <div>
                        <div className={styles.icon}>
                          <img alt='' src='/staticImages/g1.svg' />
                        </div>
                        <h3>Launch a Contest</h3>
                        <p className={styles.mb5}>
                          Work with hundreds of creative experts to get custom
                          name suggestions for your business or brand. All names
                          are auto-checked for URL availability.
                        </p>
                      </div>
                      <div className={styles.mb3}>
                        <a
                          href='/login'
                          className={`${styles.button} ${styles.buttonBrand}`}
                        >
                          <span>Launch a Contest</span>{' '}
                          <LiaLongArrowAltRightSolid
                            className={styles.arrowRight}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className={styles.colCard}>
                    <div className={`${styles.item} ${styles.alignBox}`}>
                      <div>
                        <div className={styles.icon}>
                          <img alt='' src='/staticImages/g2.svg' />
                        </div>
                        <h3>Explore Names For Sale</h3>
                        <p className={styles.mb5}>
                          Our branding team has curated thousands of pre-made
                          names that you can purchase instantly. All names
                          include a matching URL and a complimentary Logo Design
                        </p>
                      </div>
                      <div className={styles.mb3}>
                        <a
                          href='/login'
                          className={`${styles.button} ${styles.buttonBrand}`}
                        >
                          <span>Explore Names For Sale</span>{' '}
                          <LiaLongArrowAltRightSolid
                            className={styles.arrowRight}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className={styles.colCard}>
                    <div className={`${styles.item} ${styles.alignBox}`}>
                      <div>
                        <div className={styles.icon}>
                          <img alt='' src='/staticImages/g3.svg' />
                        </div>
                        <h3>Agency-level Managed Contests</h3>
                        <p className={styles.mb5}>
                          Our Managed contests combine the power of
                          crowdsourcing with the rich experience of our branding
                          consultants. Get a complete agency-level experience at
                          a fraction of Agency costs
                        </p>
                      </div>
                      <div className={styles.mb3}>
                        <a
                          href='/login'
                          className={`${styles.button} ${styles.buttonBrand}`}
                        >
                          <span>Learn More</span>{' '}
                          <LiaLongArrowAltRightSolid
                            className={styles.arrowRight}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.textCenter}></div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.homeBlock}>
          <div className={styles.container}>
            <div className={styles.hbCaption}>
              <div className={styles.max500}>
                <img
                  className={styles.iconImg}
                  width='70'
                  src='/staticImages/icon-27.svg'
                  alt='SVG'
                  data-parent='#icon114'
                />
                <h3>How Do Naming Contests Work?</h3>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.stepCard}>
                <span>Step 1</span>
                <p>
                  Fill out your Naming Brief and begin receiving name ideas in
                  minutes
                </p>
                <LiaLongArrowAltRightSolid className={styles.arrowRight} />
              </div>
              <div className={styles.stepCard}>
                <span>Step 2</span>
                <p>
                  Rate the submissions and provide feedback to creatives.
                  Creatives submit even more names based on your feedback.
                </p>
                <LiaLongArrowAltRightSolid className={styles.arrowRight} />
              </div>
              <div className={styles.stepCard}>
                <span>Step 3</span>
                <p>
                  Our team helps you test your favorite names with your target
                  audience. We also assist with Trademark screening.
                </p>
                <LiaLongArrowAltRightSolid className={styles.arrowRight} />
              </div>
              <div className={styles.stepCard}>
                <span>Step 4</span>
                <p>Pick a Winner. The winner gets paid for their submission.</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default HowItWorks;

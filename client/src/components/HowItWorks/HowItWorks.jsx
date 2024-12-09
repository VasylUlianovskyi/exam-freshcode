import React, { Component } from 'react';
import { LiaLongArrowAltRightSolid } from 'react-icons/lia';
import { LiaPlusSolid } from 'react-icons/lia';
import styles from './HowItWorks.module.sass';

const faqs = [
  {
    question: 'How long does it take to start receiving submissions?',
    answer:
      'For Naming contests, you will start receiving your submissions within few minutes of launching your contest. Since our creatives are located across the globe, you can expect to receive submissions 24 X 7 throughout the duration of the brainstorming phase.',
  },
  {
    question: 'How long do Naming Contests last?',
    answer:
      'You can choose a duration from 1 day to 7 days. We recommend a duration of 3 Days or 5 Days. This allows for sufficient time for entry submission as well as brainstorming with creatives. If you take advantage of our validation services such as Audience Testing and Trademark Research, both will be an additional 4-7 days (3-5 business days for Audience Testing and 1-2 business days for Trademark Research).',
  },
  {
    question: 'Where are the creatives located?',
    answer:
      'About 70% of our Creatives are located in the United States and other English speaking countries (i.e. United Kingdom, Canada, and Australia.). We utilize an advanced rating score algorithm to ensure that high quality creatives receive more opportunities to participate in our contests.',
  },
  {
    question: 'What if I do not like any submissions?',
    answer: `While it is unusually rare that you will not like any names provided, we have a few options in case this problem occurs:

    If the contest ends and you have not yet found a name that you’d like to move forward with, we can provide complimentary extension of your contest as well as a complimentary consultation with one of our branding consultants (a $99 value).
    By exploring our premium domain marketplace you can apply the contest award towards the purchase of any name listed for sale.
    If you choose the Gold package or Platinum package and keep the contest as 'Not Guaranteed', you can request a partial refund if you choose not to move forward with any name from you project. (Please note that the refund is for the contest award). Here is a link to our Refund Policy
`,
  },
  {
    question: 'How much does it cost?',
    answer:
      'Our naming competitions start at $299, and our logo design competitions start at $299. Also, there are three additional contest level that each offer more features and benefits. See our Pricing Page for details',
  },
  {
    question:
      'I need both a Name and a Logo. Do you offer any discount for multiple contests?',
    answer:
      'Our naming competitions start at $299, and our logo design competitions start at $299. Also, there are three additional contest level that each offer more features and benefits. See our Pricing Page for details',
  },
  {
    question: 'What if I want to keep my business idea private?',
    answer:
      'You can select a Non Disclosure Agreement (NDA) option at the time of launching your competition. This will ensure that only those contestants who agree to the NDA will be able to read your project brief and participate in the contest. The contest details will be kept private from other users, as well as search engines.',
  },
  {
    question: 'Can you serve customers outside the US?',
    answer: `Absolutely. Atom services organizations across the globe. Our customer come from many countries, such as the United States, Australia, Canada, Europe, India, and MENA. We've helped more than 25,000 customer around the world.`,
  },
  {
    question: 'Can I see any examples?',
    answer: `Our creatives have submitted more than 6 Million names and thousands of logos on our platform. Here are some examples of Names, Taglines, and Logos that were submitted in recent contests.

      Name Examples
      Tagline Examples
      Logo Examples
`,
  },
];
const marketPlaceFaqs = [
  {
    question: `What's included with a Domain Purchase?`,
    answer: `When you purchase a domain from our premium domain marketplace, you will receive the exact match .com URL, a complimentary logo design (along with all source files), as well as a complimentary Trademark report and Audience Testing if you’re interested in validating your name.
`,
  },
  {
    question: 'How does the Domain transfer process work?',
    answer:
      'Once you purchase a Domain, our transfer specialists will reach out to you (typically on the same business day). In most cases we can transfer the domain to your preferred registrar (such as GoDaddy). Once we confirm the transfer details with you, the transfers are typically initiated to your account within 1 business day.',
  },
  {
    question:
      'If I purchase a Domain on installments, can I start using it to setup my website?',
    answer:
      'We offer payment plans for many domains in our Marketplace. If you purchase a domain on a payment plan, we hold the domain in an Escrow account until it is fully paid off. However our team can assist you with making any changes to the domains (such as Nameserver changes), so that you can start using the domain right away after making your first installment payment.',
  },
];
const manageFaqs = [
  {
    question: 'What are Managed Contests?',
    answer: `The 'Managed' option is a fully managed service by Atom Branding experts. It includes a formal brief preparation by Atom team and management of your contest. Managed Contests are a great fit for companies that are looking for an 'Agency' like experience and they do not want to manage the contest directly.
Our branding team has directly managed hundreds of branding projects and has learned several best practices that lead to successful project outcomes. Our team will apply all best practices towards the management of your branding project.
Learn more about our Managed Contest Service`,
  },
  {
    question: `What's a typical timeline for a Managed Contest?`,
    answer: `The overall process takes 12-13 days.

The Managed projects start with a project kick-off call with your Branding Consultant. You can schedule this call online immediately after making your payment.
After your kick-off call, the Branding consultant will write your project brief and send for your approval within 1 business day.
Upon your approval, the contest will go live. The branding consultant will help manage your project throughout the brainstorming phase (typically 5 days).
Upon the completion of brainstorming phase, the branding consultant will work with you to test the top 6 names from your Shortlist (3-5 Days). In addition, the branding consultant will coordinate the detailed Trademark screening (1-3 days)`,
  },
  {
    question: 'How much do Managed Contests cost?',
    answer: `We offer two levels of Managed Contests. Standard ($1499) and Enterprise ($2999). The Enterprise managed contest includes:

(1) a $500 award amount (instead of $300), which will attract our top Creatives and provide more options to choose from;
(2) we will ensure a senior member of our branding team is assigned to your project and the branding team will invest about 3X more time in the day-to-day management of your project;
(3) you will receive more high-end trademark report and 5X more responses for your audience test.
Here is a link to our Pricing page with a detailed comparison of the two packages.
`,
  },
  {
    question: 'Where are the Branding Consultants located?',
    answer:
      'All our branding consultants are based in in our Headquarters (Hoffman Estates, IL). Our branding consultants have many years of experience in managing hundreds of branding projects for companies ranging from early stage startups to Fortune 500 corporations.',
  },
];
const creativeFaqs = [
  {
    question: `Can anyone join your platform?`,
    answer: `We are open to anyone to signup. However, we have an extensive 'Quality Scoring' process which ensures that high quality creatives have the ability to continue to participate in the platform. On the other hand, we limit the participation from those creatives who do not consistently receive high ratings.`,
  },
  {
    question: `Can I start participating immediately upon signing up?`,
    answer: `When you initially signup, you are assigned few contests to assess your overall quality of submissions. Based upon the quality of your submissions, you will continue to be assigned additional contests. Once you have received enough high ratings on your submissions, your account will be upgraded to 'Full Access', so that you can begin participating in all open contests.`,
  },
  {
    question: 'How Do I Get Paid?',
    answer:
      'We handle creative payouts via Paypal or Payoneer. Depending upon your country of residence, we may require additional documentation to verify your identity as well as your Tax status.',
  },
];

class HowItWorks extends Component {
  state = {
    activeTab: '#collect-top',
    activeFAQ: {},
  };

  faqsTabsActive = tabId => {
    this.setState({ activeTab: tabId }, () => {
      const element = document.querySelector(tabId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  };

  toggleFAQ = (category, index) => {
    const uniqueId = `${category}-${index}`;
    this.setState(prevState => {
      const newActiveFAQ = { ...prevState.activeFAQ };
      if (newActiveFAQ[uniqueId]) {
        delete newActiveFAQ[uniqueId];
      } else {
        newActiveFAQ[uniqueId] = true;
      }
      return { activeFAQ: newActiveFAQ };
    });
  };

  renderFAQ = (faqsToRender, category) => {
    return faqsToRender.map((faq, index) => {
      const uniqueId = `${category}-${index}`;
      return (
        <div
          key={uniqueId}
          className={`${styles.faqItem} ${
            this.state.activeFAQ[uniqueId] ? styles.active : ''
          }`}
          onClick={() => this.toggleFAQ(category, index)}
        >
          <div className={styles.question}>
            <span>{faq.question}</span>
            <LiaPlusSolid
              className={`${styles.icon} ${
                this.state.activeFAQ[uniqueId] ? styles.open : ''
              }`}
            />
          </div>
          {this.state.activeFAQ[uniqueId] && (
            <div>
              <p className={styles.answer}>{faq.answer}</p>
            </div>
          )}
        </div>
      );
    });
  };

  render () {
    const { activeTab } = this.state;

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
        <section className={styles.hhInner}>
          <div className={styles.content}>
            <div className={styles.container}>
              <h3>Frequently Asked Questions</h3>
              <div className={styles.faqsTabs}>
                <span
                  className={activeTab === '#collect-top' ? styles.active : ''}
                  onClick={() => this.faqsTabsActive('#collect-top')}
                >
                  Launching A Contest
                </span>
                <span
                  className={
                    activeTab === '#collect-industry' ? styles.active : ''
                  }
                  onClick={() => this.faqsTabsActive('#collect-industry')}
                >
                  Buying From Marketplace
                </span>
                <span
                  className={
                    activeTab === '#collect-ideas' ? styles.active : ''
                  }
                  onClick={() => this.faqsTabsActive('#collect-ideas')}
                >
                  Managed Contests
                </span>
                <span
                  className={activeTab === '#for-ideas' ? styles.active : ''}
                  onClick={() => this.faqsTabsActive('#for-ideas')}
                >
                  For Creatives
                </span>
              </div>
              <h4 id='collect-top'>Launching A Contest</h4>
              <div className={styles.questionWrap}>
                {this.renderFAQ(faqs, 'faqs')}
              </div>

              <h4 id='collect-industry'>Buying From Marketplace</h4>
              <div className={styles.questionWrap}>
                {this.renderFAQ(marketPlaceFaqs, 'marketplace')}
              </div>

              <h4 id='collect-ideas'>Managed Contests</h4>
              <div className={styles.questionWrap}>
                {this.renderFAQ(manageFaqs, 'managed')}
              </div>

              <h4 id='for-ideas'>For Creatives</h4>
              <div className={styles.questionWrap}>
                {this.renderFAQ(creativeFaqs, 'creatives')}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.searchBlock}>
          <div className={styles.searchContainer}>
            <div className={styles.searchForm}>
              <div className={styles.searchIcon}></div>
              <input
                name='search_field'
                type='text'
                placeholder='Search Over 200,000+ Premium Names'
              />
              <button aria-label='Search Domain'>
                {' '}
                <span></span>
              </button>
            </div>

            <div className={styles.listTags}>
              <a href='https://www.google.com/search?q=Tech'>Tech</a>
              <a href='https://www.google.com/search?q=Clothing'>Clothing</a>
              <a href='https://www.google.com/search?q=Finance'>Finance</a>
              <a href='https://www.google.com/search?q=Real+Estate'>
                Real Estate
              </a>
              <a href='https://www.google.com/search?q=Crypto'>Crypto</a>
              <a href='https://www.google.com/search?q=Short'>Short</a>
              <a href='https://www.google.com/search?q=One+Word'>One Word</a>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default HowItWorks;

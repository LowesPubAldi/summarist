"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    question:
      "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
  },
];

export default function ChoosePlanPage() {
    const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="plan">
      <section className="plan__hero">
        <h1>Get unlimited access to many amazing books to read</h1>
        <p>Turn ordinary moments into amazing learning opportunities</p>

        <img src="/login.png" alt="" />
      </section>

      <section className="plan__features">
        <div>
          <h3>📄</h3>
          <p>Key ideas in few min with many books to read</p>
        </div>

        <div>
          <h3>🌱</h3>
          <p>3 million people growing with Summarist everyday</p>
        </div>

        <div>
          <h3>🤝</h3>
          <p>Precise recommendations collections curated by experts</p>
        </div>
      </section>

      <section className="plan__choose">
        <h2>Choose the plan that fits you</h2>

        <div className="plan__card plan__card--active">
          <span>○</span>
          <div>
            <h3>Premium Plus Yearly</h3>
            <h2>$99.99/year</h2>
            <p>7-day free trial included</p>
          </div>
        </div>

        <div className="plan__divider">or</div>

        <div className="plan__card">
          <span>○</span>
          <div>
            <h3>Premium Monthly</h3>
            <h2>$9.99/month</h2>
            <p>No trial included</p>
          </div>
        </div>

        <button>Start your free 7-day trial</button>
        <p className="plan__small">
          Cancel your trial at any time before it ends, and you won't be charged.
        </p>
      </section>
       <section className="faq">
        {faqs.map((faq, index) => (
          <div className="faq__item" key={index}>
            <button 
                className="faq__question"
                onClick={() => setOpenFaq(index)}
                >
              {faq.question}

        <span>
          {openFaq === index ? (
         <FiChevronUp />
            ) : (
         <FiChevronDown />
            )}
        </span>
            </button>

            {openFaq === index && (
              <p className="faq__answer">
          {faq.answer}
        </p>
            )}
          </div>
        ))}
        </section>
        <section id="footer">
      <div className="container">
        <div className="row">
          <div className="footer__top--wrapper">
            <div className="footer__block">
              <div className="footer__link--title">Actions</div>
              <div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Summarist Magazine</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Cancel Subscription</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Help</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Contact us</a>
                </div>
              </div>
            </div>
            <div className="footer__block">
              <div className="footer__link--title">Useful Links</div>
              <div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Pricing</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Summarist Business</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Gift Cards</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Authors & Publishers</a>
                </div>
              </div>
            </div>
            <div className="footer__block">
              <div className="footer__link--title">Company</div>
              <div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">About</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Careers</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Partners</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Code of Conduct</a>
                </div>
              </div>
            </div>
            <div className="footer__block">
              <div className="footer__link--title">Other</div>
              <div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Sitemap</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Legal Notice</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Terms of Service</a>
                </div>
                <div className="footer__link--wrapper">
                  <a className="footer__link">Privacy Policies</a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__copyright--wrapper">
            <div className="footer__copyright">
              Copyright &copy; 2023 Summarist.
            </div>
          </div>
        </div>
      </div>
    </section>
    </main>
  );
}
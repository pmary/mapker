import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory, Link } from 'react-router';

// https://twitter.com/tos?lang=en#basicterms

class TermsOfService extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Mapker Terms of Service</h1>

        <p>
          These Terms of Service (“Terms”) govern your access to and use of our
          Services,  including our various APIs, email notifications,
          applications, buttons, widgets, commerce services (the Mapker Services”),
          and any information, text, graphics, photos or other materials uploaded,
          downloaded or appearing on the Services (collectively referred to as
          “Content”). Your access to and use of the Services are conditioned on
          your acceptance of and compliance with these Terms. By accessing or
          using the Services you agree to be bound by these Terms.
        </p>

        <h2>Basic Terms</h2>
        <p>
          You are responsible for your use of the Services, for any Content you
          post to the Services, and for any consequences thereof. Most Content
          you submit, post, or display through the Mapker Services is public by
          default and will be able to be viewed by other users and through third
          party services and websites. You should only provide Content that you
          are comfortable sharing with others under these Terms.
        </p>

        <p>
          You may use the Services only if you can form a binding contract with
          Mapker and are not a person barred from receiving services under the
          laws of the applicable jurisdiction. If you are accepting these Terms
          and using the Services on behalf of a company, organization, government,
          or other legal entity, you represent and warrant that you are authorized
          to do so. You may use the Services only in compliance with these Terms
          and all applicable local, state, national, and international laws,
          rules and regulations.
        </p>

        <p>
          The Services that Mapker provides are always evolving and the form and
          nature of the Services that Mapker provides may change from time to
          time without prior notice to you. In addition, Twitter may stop
          (permanently or temporarily) providing the Services (or any features
          within the Services) to you or to users generally and may not be
          able to provide you with prior notice. We also retain the right to
          create limits on use and storage at our sole discretion at any time
          without prior notice to you.
        </p>

        <h2>Privacy</h2>
        <p>
          Any information that you or other users provide to Mapker is subject
          to our <Link to="/privacy">Privacy Policy</Link>, which governs our
          collection and use of your information. You understand that through
          your use of the Services you consent to the collection and use (as set
          forth in the Privacy Policy) of this information, including the
          transfer of this information to the France, United States, Ireland, and/or
          other countries for storage, processing and use by Mapker. As part
          of providing you the Services, we may need to provide you with
          certain communications, such as service announcements and
          administrative messages. These communications are considered part
          of the Services and your account, which you may not be able to
          opt-out from receiving.
        </p>

        <h2>Passwords</h2>
      </div>
    )
  }
}

export default TermsOfService;

import { Link } from 'react-router-dom'
import { usePageMeta } from '@/lib/seo'
import { COMPANY } from '@/lib/company'
import { H2, LegalPage, Lead, OL, P, UL, linkCls } from '@/components/legal/Prose'

// Page text is final copy from "BloomAbroad website fixes" (Complaints page,
// under Fix 3c). Linked from the footer and from Terms section 11.
export function ComplaintsPage() {
  usePageMeta({
    title: 'Complaints | BloomAbroad',
    description:
      'How to make a complaint to BloomAbroad, what happens next, and where to go if you are not happy with our response.',
    path: '/complaints',
  })

  return (
    <LegalPage title="Complaints">
      <P>
        We want every student, parent and university to feel well looked after.
        If something hasn't gone right, please tell us so we can put it right.
      </P>

      <H2>How to make a complaint</H2>
      <P>
        Email{' '}
        <a href={`mailto:${COMPANY.helloEmail}?subject=Complaint`} className={linkCls}>
          {COMPANY.helloEmail}
        </a>{' '}
        with "Complaint" in the subject line. It helps if you include:
      </P>
      <UL>
        <li>your name and order reference, if you have one;</li>
        <li>what happened, and when;</li>
        <li>what you'd like us to do to put it right.</li>
      </UL>
      <P>If it's easier, you can ask us to call you back instead.</P>

      <H2>What happens next</H2>
      <OL>
        <li>
          <Lead>We acknowledge it within 2 working days.</Lead> You'll know
          we've received your complaint and who is looking after it.
        </li>
        <li>
          <Lead>We look into it properly.</Lead> We'll review your order, your
          assessment and any messages, and we may ask you a few questions.
        </li>
        <li>
          <Lead>We give you a full response within 10 working days.</Lead>{' '}
          We'll explain what we found and what we'll do. If we need longer,
          we'll tell you why and when to expect an answer.
        </li>
      </OL>
      <P>Every complaint is resolved within 30 days.</P>

      <H2>If you think your outcome is wrong</H2>
      <P>
        If you believe your readiness outcome was based on information we
        missed or misread, tell us what you think was overlooked. We'll look at
        your assessment again. If a fact was missed or misread, we'll correct
        your outcome at no cost.
      </P>
      <P>
        We can explain how your outcome was reached, but we can't change
        decisions made by universities or by Ireland's immigration authorities.
      </P>

      <H2>If you're not happy with our response</H2>
      <P>
        You can ask for your complaint to be reviewed by Remi Kolawole, Founder.
        Reply to our response, or email{' '}
        <a href={`mailto:${COMPANY.helloEmail}?subject=Review`} className={linkCls}>
          {COMPANY.helloEmail}
        </a>{' '}
        with "Review" in the subject line, and you'll receive a final response
        within 10 working days.
      </P>
      <P>If you're still not satisfied, you can contact:</P>
      <UL>
        <li>
          <Lead>Ireland:</Lead> the Competition and Consumer Protection
          Commission (
          <a
            href="https://www.ccpc.ie"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            ccpc.ie
          </a>
          ) for information about your consumer rights. You may also be able to
          use the Small Claims procedure through the District Court.
        </li>
        <li>
          <Lead>Elsewhere in the EU:</Lead> the European Consumer Centre
          Ireland (
          <a
            href="https://www.eccireland.ie"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            eccireland.ie
          </a>
          ).
        </li>
        <li>
          <Lead>Outside the EU:</Lead> the consumer protection authority in your
          country.
        </li>
      </UL>

      <H2>Complaints about your personal information</H2>
      <P>
        Please email{' '}
        <a href={`mailto:${COMPANY.privacyEmail}`} className={linkCls}>
          {COMPANY.privacyEmail}
        </a>
        . You also have the right to complain to Ireland's Data Protection
        Commission (
        <a
          href="https://www.dataprotection.ie"
          target="_blank"
          rel="noopener noreferrer"
          className={linkCls}
        >
          dataprotection.ie
        </a>
        ) or to the data protection authority in your country. See our{' '}
        <Link to="/privacy" className={linkCls}>
          Privacy Notice
        </Link>{' '}
        for details.
      </P>
    </LegalPage>
  )
}

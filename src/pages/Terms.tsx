import { Link } from 'react-router-dom'
import { usePageMeta } from '@/lib/seo'
import { COMPANY } from '@/lib/company'
import {
  Fill,
  H2,
  LegalPage,
  Lead,
  P,
  UL,
  linkCls,
} from '@/components/legal/Prose'

// Page text is final copy from "BloomAbroad website fixes" (Fix 3b).
//
// For January (when payments open), the brief asks for a required, UNTICKED
// checkout box: "Start my assessment now. I understand I lose my right to
// cancel once my outcome is issued." — without it the cancellation period can
// extend to 12 months. That belongs to the Stripe checkout build (P2), not
// this page. Terms should also get a solicitor's review before payments open.
export function TermsPage() {
  usePageMeta({
    title: 'Terms of Service | BloomAbroad',
    description:
      'The terms for using BloomAbroad: what the readiness assessment is and is not, pricing, your right to cancel, and how to complain.',
    path: '/terms',
  })

  return (
    <LegalPage title="Terms of Service" updated={COMPANY.legalLastUpdated}>
      <H2>The short version</H2>
      <UL>
        <li>
          BloomAbroad gives you an independent view of how ready you are to
          apply to study in Ireland, reviewed by an experienced consultant.
        </li>
        <li>
          It is not an admission, visa or immigration decision, or immigration
          advice, and it doesn't guarantee any outcome.
        </li>
        <li>
          You'll see the full price before you pay. The price is the same
          whatever your outcome.
        </li>
        <li>
          You have 14 days to cancel. If we haven't started your assessment yet,
          you get a full refund.
        </li>
      </UL>

      <H2>1. Who we are</H2>
      <P>
        These terms are between you and {COMPANY.legalName}, trading as
        BloomAbroad, a company registered in Ireland (company number{' '}
        <Fill value={COMPANY.croNumber} />
        ), registered office <Fill value={COMPANY.registeredOffice} />.
        Contact:{' '}
        <a href={`mailto:${COMPANY.helloEmail}`} className={linkCls}>
          {COMPANY.helloEmail}
        </a>
        .
      </P>

      <H2>2. What BloomAbroad provides</H2>
      <P>
        BloomAbroad's readiness assessment reviews your questionnaire answers
        and documents against expert-designed readiness scenarios for studying
        in Ireland. It covers application readiness and immigration readiness.
        An experienced consultant reviews every result. You'll receive one of
        three outcomes, with the reasons behind it and suggested next steps:
      </P>
      <UL>
        <li>Ready to Apply</li>
        <li>Needs Support</li>
        <li>Not Yet in a Position to Apply</li>
      </UL>

      <H2>3. What BloomAbroad is not</H2>
      <P>
        <Lead>Not a guarantee.</Lead> Universities make admission decisions and
        Ireland's immigration authorities make visa and immigration decisions.
        No outcome from BloomAbroad guarantees, predicts or influences either.
      </P>
      <P>
        <Lead>Not legal or immigration advice.</Lead> For legal advice, please
        speak to a qualified solicitor.
      </P>
      <P>
        <Lead>Not an agent.</Lead> We don't apply to universities for you, we
        don't refer you to any institution, and we take no commission from
        anyone.
      </P>
      <P>
        <Lead>Not a financial service.</Lead> We don't prepare, source or advise
        on financial documents. We will never ask you for money to "show funds"
        or take payment for visa fees.
      </P>

      <H2>4. Who can use BloomAbroad</H2>
      <P>
        You need to be 18 or over, or have a parent or guardian's confirmation
        if you're under 18. If you pay on behalf of someone else, such as your
        child, you confirm that they agree to take the assessment.
      </P>

      <H2>5. Your information and documents</H2>
      <P>
        Your outcome depends on the information you give us, so please make
        sure it's accurate, complete and your own. If we find a document has
        been altered or doesn't belong to you, we may stop the assessment. How
        we handle your information is set out in our{' '}
        <Link to="/privacy" className={linkCls}>
          Privacy Notice
        </Link>
        .
      </P>

      <H2>6. Price and payment</H2>
      <P>
        The price is shown in your local currency, or in euro, before you pay,
        and includes everything listed for that tier. Payments are processed
        securely by Stripe through our checkout on bloomabroad.ie. The price is
        the same whatever outcome you receive.
      </P>
      <P>
        Readiness Assessment Plus calls are subject to consultant availability.
        At busy times we may temporarily pause new Plus bookings. This never
        affects bookings already made.
      </P>

      <H2>7. Timing</H2>
      <P>
        We aim to issue your outcome within 5 working days of receiving a
        complete set of answers and documents. If something is missing, we'll
        tell you what we need.
      </P>

      <H2>8. Your right to cancel</H2>
      <P>You can cancel within 14 days of buying, for any reason.</P>
      <UL>
        <li>If we haven't started your assessment, you'll get a full refund.</li>
        <li>
          If you've asked us to start straight away and the assessment is under
          way, you'll get a refund minus a fair amount for the work already
          done.
        </li>
        <li>
          Once your outcome has been issued, the service is complete. You
          agreed at checkout that you would then lose the right to cancel.
        </li>
      </UL>
      <P>
        Refunds go back to your original payment method within 14 days. We'll
        also refund you in full if we can't complete your assessment for a
        reason on our side.
      </P>
      <P>
        To cancel, email{' '}
        <a href={`mailto:${COMPANY.helloEmail}`} className={linkCls}>
          {COMPANY.helloEmail}
        </a>{' '}
        with your order reference.
      </P>

      <H2>9. Your outcome report</H2>
      <P>
        Your report is for your personal use, and you're welcome to share it
        with family or advisers. Our readiness methodology and scenarios remain
        the property of {COMPANY.legalName}.
      </P>

      <H2>10. Our responsibility to you</H2>
      <P>
        We'll provide the assessment with reasonable care and skill. We aren't
        responsible for decisions made by universities or immigration
        authorities. Nothing in these terms limits your statutory rights as a
        consumer.
      </P>

      {/* The brief requires this section to be linkable as #complaints. */}
      <H2 id="complaints">11. Questions and complaints</H2>
      <P>
        Please contact{' '}
        <a href={`mailto:${COMPANY.helloEmail}`} className={linkCls}>
          {COMPANY.helloEmail}
        </a>
        . We'll acknowledge your message within 2 working days and give you a
        full response within 10 working days. If we need longer, we'll explain
        why and tell you when to expect an answer, and we'll resolve every
        complaint within 30 days. Our full complaints procedure is on our{' '}
        <Link to="/complaints" className={linkCls}>
          Complaints page
        </Link>
        .
      </P>

      <H2>12. Changes to these terms</H2>
      <P>
        We may update these terms. The version in force when you buy applies to
        your purchase.
      </P>

      <H2>13. Governing law</H2>
      <P>
        These terms are governed by Irish law. If you live outside Ireland, you
        may also have rights under the consumer laws of your own country.
      </P>
    </LegalPage>
  )
}

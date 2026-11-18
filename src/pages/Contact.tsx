import { Link } from 'react-router-dom'
import { usePageMeta } from '@/lib/seo'
import { BOOKING_URL, COMPANY } from '@/lib/company'
import {
  Fill,
  H2,
  LegalPage,
  Lead,
  P,
  UL,
  linkCls,
} from '@/components/legal/Prose'

// Page text is final copy from "BloomAbroad website fixes" (Fix 3c).
export function ContactPage() {
  usePageMeta({
    title: 'Contact | BloomAbroad',
    description:
      "Get in touch with BloomAbroad: general questions, privacy requests, WhatsApp, and how to check a message is really from us.",
    path: '/contact',
  })

  // Until a booking link is supplied, the discovery-call link opens an email
  // to hello@ rather than pointing at nothing.
  const discoveryHref =
    BOOKING_URL ||
    `mailto:${COMPANY.helloEmail}?subject=${encodeURIComponent('Discovery call')}`

  return (
    <LegalPage title="Get in touch">
      <P>
        We'd love to hear from you. Whether you're a student, a parent or a
        university, we're here to help.
      </P>

      <P>
        <Lead>General questions, orders and complaints:</Lead>{' '}
        <a href={`mailto:${COMPANY.helloEmail}`} className={linkCls}>
          {COMPANY.helloEmail}
        </a>
      </P>
      <P>
        <Lead>Privacy and data requests:</Lead>{' '}
        <a href={`mailto:${COMPANY.privacyEmail}`} className={linkCls}>
          {COMPANY.privacyEmail}
        </a>
      </P>
      <P>We reply within 2 working days, Monday to Friday.</P>

      <P>
        <Lead>WhatsApp:</Lead> <Fill value={COMPANY.whatsappNumber} /> For quick
        questions about BloomAbroad. Please don't send documents by WhatsApp.
        Upload them securely through your assessment.
      </P>

      <P>
        <Lead>Universities and colleges</Lead> Interested in early access for
        your institution?{' '}
        <a href={discoveryHref} className={linkCls}>
          Book a 30-minute discovery call
        </a>{' '}
        with Remi Kolawole, Founder.
      </P>

      <H2>Making sure it's really us</H2>
      <UL>
        <li>Our only websites are bloomabroad.ie and bloomabroad.ai.</li>
        <li>
          We only take payment through our secure checkout, never by bank
          transfer to a personal account.
        </li>
        <li>
          We will never ask you for money to "show funds", and we never handle
          visa fees.
        </li>
        <li>
          If you're unsure whether a message is from us, email us before you
          reply or pay.
        </li>
      </UL>
      <P>
        <Link to="/verify" className={linkCls}>
          How to verify it's really us →
        </Link>
      </P>

      <H2>Our details</H2>
      <P>
        BloomAbroad is a trading name of {COMPANY.legalName}, registered in
        Ireland. Company number: <Fill value={COMPANY.croNumber} /> Registered
        office: <Fill value={COMPANY.registeredOffice} />
      </P>
      <P>
        <Link to="/privacy" className={linkCls}>
          Privacy Notice
        </Link>{' '}
        ·{' '}
        <Link to="/terms" className={linkCls}>
          Terms of Service
        </Link>{' '}
        ·{' '}
        <Link to="/complaints" className={linkCls}>
          Complaints
        </Link>
      </P>
    </LegalPage>
  )
}

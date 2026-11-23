import { Link } from 'react-router-dom'
import { usePageMeta } from '@/lib/seo'
import { COMPANY } from '@/lib/company'
import {
  Fill,
  H2,
  LegalPage,
  Lead,
  P,
  Table,
  UL,
  linkCls,
} from '@/components/legal/Prose'

// Page text is final copy from "BloomAbroad website fixes" (Fix 3a). Anything
// that comes from COMPANY is a value the brief marks as a placeholder.
export function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Notice | BloomAbroad',
    description:
      "How BloomAbroad collects, uses and protects your information, and how to ask to see, correct or delete it.",
    path: '/privacy',
  })

  return (
    <LegalPage title="Privacy Notice" updated={COMPANY.legalLastUpdated}>
      <H2>The short version</H2>
      <UL>
        <li>
          We're BloomAbroad, an Irish company. We only collect what we need to
          keep you updated and to run your readiness assessment.
        </li>
        <li>
          We never sell your information, and we don't pass it to universities,
          agents or immigration authorities unless you ask us to.
        </li>
        <li>
          If you're under 18, a parent or guardian needs to confirm before we
          send you anything.
        </li>
        <li>
          You can ask to see, correct or delete your information at any time.
          Just email{' '}
          <a href={`mailto:${COMPANY.privacyEmail}`} className={linkCls}>
            {COMPANY.privacyEmail}
          </a>
          .
        </li>
      </UL>

      <H2>1. Who we are</H2>
      <P>
        BloomAbroad is a trading name of {COMPANY.legalName}, a company
        registered in Ireland (company number <Fill value={COMPANY.croNumber} />
        ), registered office <Fill value={COMPANY.registeredOffice} />.{' '}
        {COMPANY.legalName} is the data controller for the information
        described here. Contact:{' '}
        <a href={`mailto:${COMPANY.privacyEmail}`} className={linkCls}>
          {COMPANY.privacyEmail}
        </a>
        .
      </P>

      <H2>2. What we collect</H2>
      <UL>
        <li>
          <Lead>When you join the waitlist:</Lead> your name, email, WhatsApp
          number (if you give it), country, study level, intended start date
          and age band. If you're under 18, we also collect your parent or
          guardian's email.
        </li>
        <li>
          <Lead>When you take an assessment:</Lead> your answers to the
          readiness questionnaire and the documents you upload, such as your
          passport and academic records.
        </li>
        <li>
          <Lead>When you pay:</Lead> our payment provider Stripe handles your
          card details. We never see or store your full card number.
        </li>
        <li>
          <Lead>When you use the website:</Lead> basic technical information,
          and cookies only if you agree to them (see our{' '}
          <Link to="/cookies" className={linkCls}>
            Cookie Notice
          </Link>
          ).
        </li>
      </UL>

      <H2>3. Why we use it, and our legal basis</H2>
      <Table
        head={['Purpose', 'Legal basis']}
        rows={[
          [
            'Sending you waitlist and launch updates',
            'Your consent, which you can withdraw at any time',
          ],
          [
            'Running your assessment and the consultant review',
            'Performing our contract with you',
          ],
          ['Keeping financial and tax records', 'Legal obligation'],
          [
            'Keeping our service secure and improving our readiness scenarios, using information with names and contact details removed',
            'Our legitimate interests',
          ],
        ]}
      />

      <H2>4. How outcomes are reached</H2>
      <P>
        Your assessment applies expert-designed readiness scenarios, and an
        experienced consultant reviews every result before it's issued. No
        outcome is made by automated means alone. An outcome is our view of your
        readiness. It is not an admission, visa or immigration decision, and it
        doesn't guarantee one.
      </P>

      <H2>5. If you're under 18</H2>
      <P>
        If you're under 18, we ask a parent or guardian to confirm before we
        contact you or carry out an assessment. We don't use under-18s'
        information for targeted marketing or profiling.
      </P>

      <H2>6. Who we share it with</H2>
      <P>
        We share information only with service providers who help us run
        BloomAbroad: Vercel (website hosting), Supabase (database and secure
        document storage), {COMPANY.emailProvider} (email), Stripe (payments),
        and consultants who review assessments under a confidentiality
        agreement. Each one may use it only on our instructions. We do not sell
        your information, and we do not share it with any university, agent or
        immigration authority unless you ask us to.
      </P>

      <H2>7. Transfers outside the EU</H2>
      <P>
        Your information is stored in <Fill value={COMPANY.dataRegion} />. If a
        provider processes it outside the European Economic Area, we use
        safeguards approved by the European Commission, such as Standard
        Contractual Clauses.
      </P>

      <H2>8. How long we keep it</H2>
      <UL>
        <li>
          <Lead>Waitlist details:</Lead> until you unsubscribe, or{' '}
          {COMPANY.waitlistRetention} after our launch, whichever comes first.
        </li>
        <li>
          <Lead>Assessment records:</Lead> {COMPANY.assessmentRetention} after
          your assessment, so we can answer questions about it.
        </li>
        <li>
          <Lead>Payment records:</Lead> six years, as Irish tax law requires.
        </li>
      </UL>

      <H2>9. Your rights</H2>
      <P>
        You can ask to access, correct or delete your information, to restrict
        or object to how we use it, or to receive a copy to take elsewhere. You
        can withdraw consent at any time. Email{' '}
        <a href={`mailto:${COMPANY.privacyEmail}`} className={linkCls}>
          {COMPANY.privacyEmail}
        </a>{' '}
        and we'll reply within one month. You can also complain to Ireland's
        Data Protection Commission (
        <a
          href="https://www.dataprotection.ie"
          target="_blank"
          rel="noopener noreferrer"
          className={linkCls}
        >
          dataprotection.ie
        </a>
        ) or to the data protection authority in your country, such as the NDPC
        in Nigeria, the ODPC in Kenya or the Data Protection Commission in
        Ghana.
      </P>

      <H2>10. Changes to this notice</H2>
      <P>
        If we make an important change, we'll update the date at the top and
        let you know by email.
      </P>
    </LegalPage>
  )
}

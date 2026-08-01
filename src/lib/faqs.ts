import type { Audience } from '@/components/audience'

export type Faq = { q: string; a: string[] }

/**
 * FAQ copy, verbatim from the client's source documents
 * ("FAQs for Universities.docx" / "FAQs for Students.docx").
 * Each answer is an array of paragraphs.
 */
export const FAQS: Record<Audience, Faq[]> = {
  universities: [
    {
      q: 'What is BloomAbroad?',
      a: [
        'BloomAbroad is an enrolment readiness screening platform for international applications. Institutions submit applications they have already received, and the platform assesses whether the file is complete enough to assess, and whether the applicant is positioned to satisfy visa requirements and complete the course — not only whether they meet published entry criteria.',
        'It is not a study abroad marketplace. BloomAbroad does not source, refer, or send applicants to institutions, and has no interest in where any applicant applies. It works only on applications your office has already received. Its initial focus is screening — establishing which of the applications already in front of you are likely to convert to enrolment. Admissions decisions remain entirely with the institution.',
        'The methodology was designed by practitioners with more than a decade of experience in international student recruitment and migration advisory work, and is built on real application, admissions, and visa outcome data accumulated across that period. Findings are validated by experienced consultants rather than issued automatically.',
        'BloomAbroad is currently in development, beginning with Ireland. Institutions can register interest through the waitlist.',
      ],
    },
    {
      q: 'What is enrolment readiness screening and how do universities use it?',
      a: [
        'Enrolment readiness screening assesses international applicants on whether they are positioned to secure a place, satisfy visa requirements, and complete their course — not only whether they meet published entry criteria. It applies a consistent standard across applicants rather than relying on individual judgement, which varies between reviewers and across recruitment cycles.',
        'Universities use it to resolve incomplete applications and identify risk earlier. Applicants who meet academic minimums but carry risk elsewhere still consume resources: staff hours spent chasing documents, offers that do not convert, and in some cases a visa refusal after an offer has been accepted. The platform identifies what is missing from each file and allows the admissions team to request it directly, then assesses the applicant once the file is complete — surfacing those signals before further resources are committed, and producing a structured record of how each assessment was reached.',
        'Assessment findings are validated by experienced consultants rather than issued automatically, and each outcome is recorded with the reasoning behind it. BloomAbroad is designed to deliver this for applications institutions have already received, starting with Ireland and expanding to further destinations.',
      ],
    },
    {
      q: 'How does a university use BloomAbroad in its admissions workflow?',
      a: [
        'BloomAbroad works on international applications an institution has already received. Where a file is incomplete, the platform identifies what is missing and the admissions team requests it from the applicant through the platform.',
        'Once a file is complete, the applicant is assessed for enrolment readiness across both application readiness and visa readiness. The admissions team receives a readiness report setting out the outcome, the reasoning behind it, what is missing or weak, and recommended next steps. Findings are validated by experienced consultants rather than issued automatically, so assessments remain consistent between reviewers and across recruitment cycles, and each decision is auditable.',
        'Outcomes distinguish applicants who are ready to progress from those who need specific preparation first, and those who are not in a position to proceed — so teams can direct effort where it changes enrolment outcomes.',
        'BloomAbroad is currently in development, starting with Ireland and expanding to further destinations. Early access is available to institutions on request.',
      ],
    },
    {
      q: 'How do universities reduce the risk of enrolling international students who are not prepared to succeed?',
      a: [
        'Most institutions rely on a combination of conditional offers, English language requirements, credibility interviews, and closer oversight of recruitment partners. These work, but they are applied late and unevenly — usually after an application has been processed, and often inconsistently between reviewers and across cycles.',
        'The more effective approach is to assess readiness earlier and to the same standard for every applicant. That distinction matters because applicants who are not ready are not necessarily unsuitable: some need specific preparation before they progress, and screening that only accepts or rejects discards students who could have enrolled successfully with the right intervention. Identifying which is which is the point of enrolment readiness screening.',
        'BloomAbroad is designed to make that assessment consistent and early, so institutions can direct support where it changes outcomes and decline where it does not.',
      ],
    },
    {
      q: 'How does early screening improve international student enrolment?',
      a: [
        'The gap between applications received and students enrolled is where most admissions effort is lost. Offers are made to applicants who never accept. Files stall because outstanding documents are never supplied. Offers are accepted and then refused at visa stage. Some applicants apply without a settled intention to enrol at all, and progress through the process regardless.',
        'Each of these consumes the same staff time as an application that converts. None of them are visible in a file checked only against entry criteria, because each one meets the criteria.',
        'Screening addresses this by assessing whether an applicant is positioned to progress all the way to enrolment — not only to receive an offer. Applicants who need specific preparation are separated from those who are not in a position to proceed, so effort concentrates where it produces enrolments. BloomAbroad is designed to make that assessment early and to a consistent standard.',
      ],
    },
    {
      q: 'What does it cost a university to process international applications that do not convert?',
      a: [
        'The direct cost is staff time. Every application consumes the same processing hours whether or not it results in an enrolment: reviewing the file, chasing outstanding documents, assessing qualifications, issuing conditional offers, and following up. Applications that stall or lapse absorb that effort without returning anything.',
        'The larger cost is revenue that cannot be recovered. When an applicant holds an offer and then does not enrol, the place is effectively withdrawn from the market until it is too late to fill. Late in the cycle there is no time to identify, assess, and admit a replacement — so the place goes unfilled for the full year. Non-EU fee income is a meaningful part of the picture for many institutions, so unconverted offers carry a cost beyond the administrative effort involved.',
        'This also disrupts planning across the institution. Offers extended to applicants who never enrol distort forecasts that programme staffing, accommodation, and support services depend on.',
        'These costs are difficult to see because they are distributed rather than recorded against individual applications. Screening makes the distinction visible early enough to act on, so places are held for applicants positioned to enrol.',
      ],
    },
    {
      q: 'Is BloomAbroad a study abroad marketplace?',
      a: [
        'No. Marketplaces in international education are built around connection — presenting course and institution options and supporting applicants toward a placement. That model is well established and serves a real need, but it begins from the assumption that an applicant is ready to apply.',
        "BloomAbroad's initial focus is what comes before that: enrolment readiness. It assesses whether an applicant is positioned to secure a place, satisfy visa requirements, and complete their course — independently of where they eventually apply.",
        'Readiness assessment is not currently a standard step in the international admissions process. Applicants and institutions typically discover readiness gaps after an application has been submitted, or after a visa refusal. BloomAbroad exists to move that discovery earlier, and where an applicant needs support to become ready, to help them find it.',
      ],
    },
    {
      q: 'What is a BloomAbroad assessment based on?',
      a: [
        'The assessment applies a structured methodology built from real application, admissions, and outcome data accumulated over more than a decade of study abroad services, international student recruitment, and migration advisory work. It draws on documented student journeys — what was submitted, what happened, and why — rather than published entry criteria alone.',
        'That distinction is the point. Entry criteria describe the minimum an applicant must meet. Outcome data shows which profiles actually progressed to enrolment and which did not, and where the difference lay. The methodology encodes that reasoning so it can be applied consistently rather than depending on who happens to review a file.',
        'Findings are validated by experienced consultants before an outcome is issued. The criteria have also been reviewed with international admissions teams to confirm they reflect the decisions institutions are making in practice.',
      ],
    },
  ],

  students: [
    {
      q: 'What is BloomAbroad?',
      a: [
        'BloomAbroad is an enrolment readiness platform for international students. It is designed to tell you where you stand before you apply — not only whether you meet a university’s published entry criteria, but whether you are positioned to receive an offer, satisfy visa requirements, and complete your course.',
        'You use it independently, before you apply anywhere. It is not a study abroad marketplace and it does not sell you a destination. Its initial focus is readiness — establishing where you actually stand, before the question of where to apply arises.',
        'The methodology was designed by advisers with more than a decade of experience in study abroad services, international student recruitment, and migration advisory work, and is built on real application, admissions, and visa outcome data gathered across that period. Findings are reviewed by experienced consultants rather than issued automatically.',
        'BloomAbroad is currently in development, starting with Ireland. You can register interest through the waitlist.',
      ],
    },
    {
      q: 'What is enrolment readiness and why does it matter for international students?',
      a: [
        'Enrolment readiness is a measure of how well positioned an applicant is to secure a place, satisfy visa requirements, and complete their course — not simply whether they meet the published minimum requirements. It considers an applicant’s profile as a whole rather than any single criterion in isolation.',
        'Enrolment readiness has two components: application readiness — whether you are positioned to secure a place — and visa readiness, whether your circumstances and documentation stand up to immigration scrutiny. Both are assessed together, because strength in one does not offset weakness in the other.',
        'It matters because published requirements are a floor, not a prediction. Applicants who meet them are still rejected at application stage or refused at visa stage every year, often for reasons that were visible beforehand. Enrolment readiness is the difference between being eligible on paper and being ready in practice.',
        'Readiness is not a guarantee. Admission decisions rest with institutions and visa decisions rest solely with immigration authorities. BloomAbroad is designed to show you where you stand and what to strengthen — not to promise an outcome.',
      ],
    },
    {
      q: 'Can I check my readiness to study abroad before paying application fees?',
      a: [
        'Yes. Until recently, most international students only found out whether they were genuinely ready after they had paid application fees, gathered documents, and waited months for a decision — or after a visa refusal. A pre-application readiness check reverses that order. Instead of applying and hoping, you assess your position first: how your qualifications map to the requirements, where your evidence is weak, and what would need to change before an application is likely to succeed.',
        'BloomAbroad is built to do exactly this — an enrolment readiness assessment benchmarked against a decade of real application and outcome data, returning one of three clear answers: you are ready to apply, you need specific support before applying, or you are not yet in a position to apply — with the reasons behind that decision.',
        'Assessments are not fully automated. Findings generated by the platform are reviewed and validated by an experienced consultant before an outcome is issued. BloomAbroad is currently in development, with Ireland as the first destination and further study destinations to follow. Early access is available by joining the waitlist.',
      ],
    },
    {
      q: 'How do I know if I am eligible to study in Ireland as an international student?',
      a: [
        'Eligibility to study in Ireland as an international student is not a single checkbox. The requirements most applicants know about — academic entry criteria for the course, English language proficiency, proof of funds for tuition and living costs, and evidence of genuine study intent — are only the visible layer. Irish universities and the Irish Immigration Service assess these together, alongside other factors that shape whether an application succeeds.',
        'Meeting the published minimums does not mean you are ready to apply. BloomAbroad’s enrolment readiness assessment is designed to examine the full picture, benchmarked against a decade of real application and outcome data, so you know where you genuinely stand before you commit time or money.',
      ],
    },
    {
      q: 'What are the most common reasons international student applications are rejected by Irish universities?',
      a: [
        'Most international applications to Irish universities are rejected for reasons that were visible before the application was submitted. The recurring ones include qualifications that do not map cleanly to Irish entry requirements, English language evidence that falls short or has expired, incomplete or inconsistent documentation, and a course choice that does not follow logically from previous study.',
        'A separate and often overlooked issue is timing — many Irish courses recruit on a rolling basis, so a strong application submitted late can still be declined. It is also important to distinguish rejection by a university from refusal at the visa stage; these are two separate decisions, and an offer from a university does not guarantee a visa will be granted. BloomAbroad is designed to identify these gaps before an application is submitted, so applicants and institutions are not discovering them after the fact.',
      ],
    },
    {
      q: 'Why are international student visa applications refused after a university offer has been received?',
      a: [
        'A university offer and a study visa are two separate decisions, made by different bodies against different criteria. A university assesses whether you can succeed academically. The Irish Immigration Service assesses whether your finances, documentation, and study plan hold up to immigration scrutiny. Refusals commonly follow from unclear evidence of funds, inconsistencies between documents, a course choice that does not follow logically from previous study, previous visa refusals from any country, or weak evidence of ties to your home country. None of these are academic failings, which is why a strong offer holder can still be refused.',
        'Requirements are standardised, but applications are not read uniformly — individual circumstances shape the outcome, which is why advice that worked for someone else may not hold for you. BloomAbroad is designed to assess each applicant on their own circumstances and surface these risks before an application is submitted.',
      ],
    },
    {
      q: 'What does a university look at when assessing an international student application?',
      a: [
        'Universities assess an international application on more than grades. The core elements are your academic qualifications and how they map to Irish entry requirements, your English language evidence, and whether your chosen course follows logically from your previous study. Admissions teams also weigh the coherence of your personal statement, the consistency of your documentation, and whether your application arrived early enough in a rolling cycle to still be competitive.',
        'Increasingly, admissions teams also consider whether an applicant is likely to convert an offer into an enrolment and complete the course. An application that meets the academic minimum but signals risk elsewhere can still be declined. BloomAbroad is designed to show you how your profile reads from the institution’s side, before you apply.',
      ],
    },
    {
      q: 'How can I improve my chances of getting into an Irish university as an international student?',
      a: [
        'The most effective improvements happen before an application is submitted, not after. Apply early — many Irish courses recruit on a rolling basis, so even a strong application competes for fewer remaining places late in the cycle. Make sure your course choice follows logically from your previous study, and be ready to explain the reasoning if it does not. Check that your English language evidence is valid and has not expired. Ensure your documents are complete and internally consistent, as unexplained discrepancies raise questions that are difficult to resolve later.',
        'Beyond these, the highest-leverage step is knowing which gaps in your own profile actually matter. That is what enrolment readiness measures, and it varies by applicant — strengthening the wrong thing costs time without improving your position. BloomAbroad is designed to identify where your specific profile is weak, so you can address it before applying rather than after a rejection.',
      ],
    },
    {
      q: "What factors beyond academic grades affect an international student's application success?",
      a: [
        'Academic grades determine whether you meet a course’s entry criteria. They do not, on their own, determine whether an application succeeds. Timing matters, because rolling admissions reward early applicants. So does the internal consistency of your documents, the logic connecting your previous study to your chosen course, and the clarity of the evidence supporting your circumstances.',
        'What is less widely understood is that these factors interact. A weakness in one area can be offset by strength elsewhere, or it can compound — the same gap carries different weight depending on the rest of the profile. Applications are read as a whole, not scored line by line, which is why two applicants with identical grades can receive different outcomes.',
        'Enrolment readiness measures that whole picture. BloomAbroad is designed to assess how the elements of your profile read together, not just whether each one meets a minimum.',
      ],
    },
    {
      q: 'Do all international students face the same visa requirements?',
      a: [
        'No. The published requirements for an Irish study visa are standardised, but they are not applied to every applicant in the same way. Requirements vary by course type and duration, and the process itself differs depending on where you apply from. Beyond that, applications are assessed individually — the same documentation can be read differently depending on an applicant’s wider circumstances.',
        'This is why comparisons between applicants are unreliable. Two people who both meet the published requirements can receive different outcomes, and an approach that worked for a friend, a relative, or someone in an online group may not hold for you. Checklists describe the minimum; they do not describe how your particular application will be read.',
        'BloomAbroad is designed to assess applicants on their own circumstances rather than against a generic standard. Visa decisions rest solely with immigration authorities.',
      ],
    },
    {
      q: 'Does BloomAbroad guarantee admission or a visa?',
      a: [
        'No. Admission decisions rest with institutions and visa decisions rest solely with the relevant immigration authority. No platform, agency, or adviser can guarantee either outcome, and any service that suggests otherwise should be treated with caution.',
        'What an enrolment readiness assessment provides is a clear view of where an applicant stands before they apply: whether they are positioned to progress, what is missing or weak, and what would need to change. That reduces the risk of applying unprepared. It does not transfer the decision away from the institutions and authorities that make it.',
        'This distinction matters because the cost of a rejection or refusal is not only the application fee. It is the months spent waiting, the documents assembled, and in many cases a record of refusal that increases scrutiny on any future application. Knowing where you stand beforehand is what readiness offers.',
      ],
    },
    {
      q: 'What is a BloomAbroad assessment based on?',
      a: [
        'The assessment applies a structured methodology built from real application, admissions, and outcome data accumulated over more than a decade of study abroad services, international student recruitment, and migration advisory work. It draws on documented student journeys — what was submitted, what happened, and why — rather than published entry criteria alone.',
        'That distinction is the point. Entry criteria describe the minimum an applicant must meet. Outcome data shows which profiles actually progressed to enrolment and which did not, and where the difference lay. The methodology encodes that reasoning so it can be applied consistently rather than depending on who happens to review a file.',
        'Findings are validated by experienced consultants before an outcome is issued. The criteria have also been reviewed with international admissions teams to confirm they reflect the decisions institutions are making in practice.',
      ],
    },
  ],
}

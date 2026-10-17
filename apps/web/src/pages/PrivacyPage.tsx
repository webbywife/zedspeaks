import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const FONT = { fontFamily: "'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif" }
const CONTACT = 'zedspeaks.info@gmail.com'
const UPDATED = '17 October 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
      <div className="flex flex-col gap-3 text-slate-700 leading-relaxed">{children}</div>
    </section>
  )
}

/** Privacy Notice (Data Privacy Act of 2012, RA 10173). Kept true to what the app actually does. */
export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white" style={FONT}>
      <nav className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft size={18} /> Home</Link>
          <span className="ml-auto text-xl font-extrabold text-pink-600">ZedSpeaks</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 py-12 flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Privacy Notice</h1>
          <p className="text-slate-500">Last updated {UPDATED}</p>
          <div className="rounded-3xl bg-pink-50 border border-pink-100 p-5 text-slate-800 leading-relaxed">
            <b>In short:</b> we keep only your email, so you can sign in. We never ask for your name or your child's name,
            and everything your child adds or says in the app stays on your own phone or tablet.
          </div>
        </header>

        <Section title="Who we are">
          <p>
            ZedSpeaks is a free picture talker for non-verbal children, made by a mom for her son Zed. ZedSpeaks is the
            personal information controller for the little data described here. For any privacy question or request,
            email <a href={`mailto:${CONTACT}`} className="text-pink-700 font-semibold underline">{CONTACT}</a>.
          </p>
        </Section>

        <Section title="What we keep">
          <ul className="list-disc pl-6 flex flex-col gap-2">
            <li><b>Your email address</b>, to sign you in and to tell you when your access is approved.</li>
            <li><b>Your password</b>, if you sign in with email. It is stored only as a one-way scrambled code (Argon2id), so no one, including us, can read it.</li>
            <li><b>Your account status</b>: whether your access is approved, and whether you are the administrator.</li>
            <li><b>A sign-in cookie</b> that keeps you signed in for up to 90 days (renewed while you use the app). Our database stores only a scrambled version of it.</li>
          </ul>
          <p>
            If you choose <b>Continue with Google</b>, Google tells us your email address and that it is verified. We do not keep
            your Google ID, name or photo.
          </p>
        </Section>

        <Section title="Feedback you choose to send">
          <p>
            If you send feedback from the Me tab, we keep your rating and message. It is anonymous: it is not linked to your
            account unless you tick "You can email me back", in which case we keep your email with it so we can reply.
            You can ask us to delete any feedback.
          </p>
        </Section>

        <Section title="If you contact us to sponsor or collaborate">
          <p>
            The form on our Support page asks for your name, organisation (optional), email and message. We keep them only to
            reply and to follow up on your offer, and delete them when you ask or when they're no longer needed.
          </p>
        </Section>

        <Section title="What we never collect">
          <ul className="list-disc pl-6 flex flex-col gap-2">
            <li>Your name, or your child's name, age, school or diagnosis.</li>
            <li>What your child taps or says in the app, or any record of it.</li>
            <li>Your photos.</li>
            <li>Location, contacts, advertising IDs or tracking cookies. ZedSpeaks has no ads and no analytics.</li>
          </ul>
        </Section>

        <Section title="What stays on your own device">
          <p>
            Photos you add (your child's toys, snacks, the dishes you cook), saved phrases and app settings are kept only in your
            browser on that phone or tablet. They are never uploaded to us. You can remove them anytime by deleting the photos in
            the app, or by clearing this site's data in your browser settings.
          </p>
        </Section>

        <Section title="Why we use your email, and on what basis">
          <p>
            Only to run your account: sign you in, review your request for access, and send you the approval email. We rely on your
            consent, which you give when you create an account, and on what is needed to provide the service you asked for.
            We never sell or share your email for marketing, and we will never send you newsletters unless you ask.
          </p>
        </Section>

        <Section title="Who can see it">
          <p>Only the ZedSpeaks administrator. Your email is also handled by these services, only to run ZedSpeaks:</p>
          <ul className="list-disc pl-6 flex flex-col gap-2">
            <li><b>Our hosting server</b>, located in Buffalo, New York, USA, where the account database is kept. This means your email is stored outside the Philippines.</li>
            <li><b>Google</b>, only if you choose Google sign-in, and to send our approval email (Gmail).</li>
            <li><b>ElevenLabs</b>, for typed words only, as described below (no email or account details).</li>
          </ul>
          <p>
            Picture cards use voices recorded in advance. When your child <b>types</b> something new (or a family photo has a new
            name), only that text is sent from our server to <b>ElevenLabs</b>, our voice provider, to say it in the same voice.
            It is sent without your email or any account details, it is not logged, and the finished sound is saved only so the
            same words play instantly next time. Offline, the phone's own voice is used instead.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Until you ask us to delete your account. Sign-in sessions end after 90 days without use. If your access request is
            not approved, we delete it on request.
          </p>
        </Section>

        <Section title="How we protect it">
          <p>
            Encrypted connections (HTTPS) everywhere, scrambled passwords and sign-in codes, cookies that scripts cannot read,
            server checks that let each family see only their own account, and access limited to the administrator.
          </p>
        </Section>

        <Section title="Your rights">
          <p>Under the Data Privacy Act of 2012 (RA 10173), you have the right to:</p>
          <ul className="list-disc pl-6 flex flex-col gap-2">
            <li>be told what we keep and why (this notice),</li>
            <li>see the data we keep about you, and get a copy of it,</li>
            <li>correct it,</li>
            <li>object, or withdraw your consent,</li>
            <li>have it deleted,</li>
            <li>and file a complaint with the National Privacy Commission (<a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-pink-700 font-semibold underline">privacy.gov.ph</a>).</li>
          </ul>
          <p>
            To use any of these rights, email <a href={`mailto:${CONTACT}`} className="text-pink-700 font-semibold underline">{CONTACT}</a> from
            the email address on your account. We will reply within 15 days.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Accounts are for parents, guardians and the professionals working with them. Children use ZedSpeaks through a parent's
            account and are never asked for any information.
          </p>
        </Section>

        <Section title="Changes">
          <p>If we change how we handle data, we will update this page and the date at the top before the change takes effect.</p>
        </Section>
      </main>

      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-500">
        <Link to="/" className="font-semibold text-pink-700">ZedSpeaks</Link> · Free for families, always.
      </footer>
    </div>
  )
}

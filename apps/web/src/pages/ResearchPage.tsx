import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Check, ExternalLink, X } from 'lucide-react'

const FONT = { fontFamily: "'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif" }

// Every claim below comes from the published studies listed at the bottom (checked 17 Oct 2026).
const FINDINGS = [
  {
    title: 'Picture-based communication helps autistic children communicate',
    text: 'A review of 24 studies on picture and speech-device systems for people with autism found large positive effects, especially on communication skills. Speech-generating devices (apps that speak, like ZedSpeaks) and picture exchange showed the biggest effects.',
    source: 'Ganz et al., 2012',
  },
  {
    title: 'AAC does not stop children from learning to talk',
    text: 'Across the strongest studies of children and adults with developmental disabilities, no one lost speech after starting AAC, and 89% showed some gains in speech.',
    source: 'Millar, Light & Schlosser, 2006',
  },
  {
    title: 'The same holds for children with autism',
    text: 'A review focused on autistic children found that AAC did not hold back speech, and most studies reported more speech after AAC was introduced.',
    source: 'Schlosser & Wendt, 2008; updated by White et al., 2021',
  },
  {
    title: "Children don't need to be 'ready' first",
    text: 'Researchers describe the idea that a child must reach a certain age or skill level before using AAC as a myth. AAC can be part of support from the very start, not a last resort.',
    source: 'Romski & Sevcik, 2005',
  },
]

const MYTHS = [
  { myth: 'Using AAC means my child will stop trying to talk.', fact: 'Studies found no loss of speech, and most children talked a little more.' },
  { myth: 'AAC is a last resort, only when everything else fails.', fact: 'It can be used early, alongside speech therapy.' },
  { myth: 'My child is too young, or not ready yet.', fact: 'There are no prerequisite skills or age required to start.' },
]

const SOURCES = [
  {
    cite: 'Ganz, J. B., et al. (2012). A meta-analysis of single case research studies on aided augmentative and alternative communication systems with individuals with autism spectrum disorders. Journal of Autism and Developmental Disorders, 42(1), 60–74.',
    url: 'https://link.springer.com/article/10.1007/s10803-011-1212-2',
  },
  {
    cite: 'Millar, D. C., Light, J. C., & Schlosser, R. W. (2006). The impact of augmentative and alternative communication intervention on the speech production of individuals with developmental disabilities: A research review. Journal of Speech, Language, and Hearing Research, 49(2), 248–264.',
    url: 'https://pubs.asha.org/doi/10.1044/1092-4388(2006/021)',
  },
  {
    cite: 'Schlosser, R. W., & Wendt, O. (2008). Effects of augmentative and alternative communication intervention on speech production in children with autism: A systematic review. American Journal of Speech-Language Pathology, 17(3), 212–230.',
    url: 'https://pubs.asha.org/doi/10.1044/1058-0360(2008/021)',
  },
  {
    cite: 'White, E. N., et al. (2021). Augmentative and alternative communication and speech production for individuals with ASD: A systematic review (25 single-case and 3 group studies, 1975–2020).',
    url: 'https://apps.asha.org/EvidenceMaps/Articles/ArticleSummary/0d044f51-9a5f-442f-9581-ceccff2840ca',
  },
  {
    cite: 'Romski, M., & Sevcik, R. A. (2005). Augmentative communication and early intervention: Myths and realities. Infants & Young Children, 18(3), 174–185.',
    url: 'https://aacworkshop.pbworks.com/f/AAC05EarlyIntMythsRealitiesRomskiSevcik.pdf',
  },
]

/** Plain-language summary of the research on AAC, with honest limits and real sources */
export function ResearchPage() {
  return (
    <div className="min-h-screen bg-white" style={FONT}>
      <nav className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft size={18} /> Home</Link>
          <span className="ml-auto text-xl font-extrabold text-pink-600">ZedSpeaks</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 py-12 flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <BookOpen className="text-pink-600" size={36} />
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Does AAC really work?</h1>
          <p className="text-lg text-slate-700 leading-relaxed">
            AAC (Augmentative and Alternative Communication) means any way to communicate besides speech: pointing to pictures,
            signs, or an app that speaks, like ZedSpeaks. Many parents worry it will stop their child from talking. Here is what
            decades of research actually say, in plain words.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-slate-900">What the research found</h2>
          {FINDINGS.map((f) => (
            <div key={f.title} className="rounded-3xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="text-slate-700 leading-relaxed mt-1">{f.text}</p>
              <p className="text-sm text-pink-700 font-semibold mt-2">{f.source}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-slate-900">Common worries, and what we know</h2>
          {MYTHS.map((m) => (
            <div key={m.myth} className="rounded-3xl bg-slate-50 p-5 flex flex-col gap-2">
              <p className="flex gap-2 text-slate-700"><X className="text-red-500 shrink-0 mt-0.5" size={18} /><span><b>Worry:</b> {m.myth}</span></p>
              <p className="flex gap-2 text-slate-900"><Check className="text-green-600 shrink-0 mt-0.5" size={18} /><span><b>Research:</b> {m.fact}</span></p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl bg-pink-50 border border-pink-100 p-6 flex flex-col gap-3">
          <h2 className="text-xl font-extrabold text-slate-900">To be honest about the limits</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-700 leading-relaxed">
            <li>Gains in <b>spoken words</b> are usually <b>modest</b>. AAC's biggest effect is on communication itself: being understood.</li>
            <li>Many studies are small, and every child is different. Results are encouraging, not guarantees.</li>
            <li>ZedSpeaks is a communication tool, not therapy. It works best alongside a speech-language pathologist or teacher who knows your child.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-extrabold text-slate-900">Read the studies</h2>
          <ol className="flex flex-col gap-3">
            {SOURCES.map((s) => (
              <li key={s.url} className="text-sm text-slate-600 leading-relaxed">
                {s.cite}{' '}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-pink-700 font-semibold underline">
                  Source <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ol>
        </section>

        <div className="text-center">
          <Link to="/login" className="px-8 py-3.5 rounded-full bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 inline-block">Try ZedSpeaks free</Link>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-500">
        <Link to="/" className="font-semibold text-pink-700">ZedSpeaks</Link> · <Link to="/privacy" className="underline">Privacy Notice</Link>
      </footer>
    </div>
  )
}

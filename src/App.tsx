import { type FormEvent, useEffect, useState } from 'react'
import type { SignalPacket } from './domain/types'
import { FluidField } from './components/FluidField'
import './App.css'

const seeded: SignalPacket = {
  requestId: 'sig_preview_402', subject: 'Algorand agentic commerce',
  summary: 'Three material signals show Algorand becoming a credible settlement rail for autonomous, pay-per-request services.',
  signals: [
    { claim: 'Official x402 AVM support is live with exact-scheme USDC payments.', confidence: .98, importance: .94, observedAt: '2026-07-18T18:40:00Z', sources: [{ title: 'x402 AVM', url: 'https://www.npmjs.com/package/@x402/avm' }] },
    { claim: 'GoPlausible combines settlement, discovery, analytics and receipts.', confidence: .96, importance: .91, observedAt: '2026-07-18T18:42:00Z', sources: [{ title: 'Facilitator docs', url: 'https://facilitator.goplausible.xyz/docs' }] },
    { claim: 'Atomic groups and deterministic finality preserve synchronous HTTP flows.', confidence: .92, importance: .89, observedAt: '2026-07-18T18:45:00Z', sources: [{ title: 'Algorand', url: 'https://algorand.co/agentic-commerce/x402' }] },
  ],
  changes: [{ type: 'new', description: 'Official Foundation SDK support is now available.' }],
  contentAngles: ['The API key is quietly being replaced by a wallet.'],
  provenance: { sourceCount: 3, generatedAt: '2026-07-18T18:45:00Z', responseHash: 'sha256:64d87b…31a2' },
  pricing: { amount: '$0.10', asset: 'USDC', network: 'Algorand Mainnet' }, payment: { status: 'preview', transaction: null },
}

const Flower = () => <svg className="flower" viewBox="0 0 48 48" aria-hidden="true"><path d="M9 39 24 7h8L20 39h-6l7-15h13l3 7H18" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round"/><path d="M29 7h8L24 39h-7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round"/></svg>

function App() {
  const [subject, setSubject] = useState('Algorand agentic commerce')
  const [intent, setIntent] = useState('creator-brief')
  const [freshness, setFreshness] = useState('24h')
  const [packet, setPacket] = useState(seeded)
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')

  useEffect(() => {
    const nodes = document.querySelectorAll('main > section')
    nodes.forEach(node => node.classList.add('scroll-reveal'))
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach(node => node.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.12 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  async function runPreview(event: FormEvent) {
    event.preventDefault(); setStatus('loading')
    try {
      const response = await fetch('/api/signals/preview', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ subject, intent, freshness }) })
      if (!response.ok) throw new Error('Preview request failed')
      setPacket(await response.json()); setStatus('idle')
    } catch { setStatus('error') }
  }

  return <div className="app-shell">
    <FluidField />
    <div className="ambient-grid" aria-hidden="true" />
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Lattice402 home"><Flower/><span>lattice<span className="brand-402">402</span></span></a>
      <nav aria-label="Primary"><a href="#playground">Playground</a><a href="#evidence">Evidence</a><a href="#developers">Developers</a></nav>
      <div className="network"><span className="pulse"/> Algorand Mainnet <b>preview</b></div>
    </header>

    <main id="top">
      <section className="hero-section">
        <div className="eyebrow"><span>PAY-PER-SIGNAL INTELLIGENCE</span><span className="mini-pill">x402 native</span></div>
        <div className="hero-grid">
          <div><h1><span className="sr-only">Intelligence agents can buy one request at a time.</span><span aria-hidden="true">Intelligence agents can buy <em>one request</em> at a time.</span></h1><p className="hero-copy">Evidence-backed research packets with sources, confidence and provenance. No account. No API key. Just USDC on Algorand.</p><div className="hero-actions"><a className="button primary" href="#playground">Run a signal preview <span>↘</span></a><a className="button secondary" href="#developers">Read the API <span>→</span></a></div></div>
          <div className="flow-card" aria-label="x402 payment flow"><div className="flow-head"><span>LIVE PAYMENT PATH</span><span className="demo-dot">DEMO MODE</span></div>{[['01','Request','Agent asks a question'],['02','402','Server quotes $0.10'],['03','USDC','GoPlausible settles'],['04','Signal','Evidence packet unlocks']].map((item,i)=><div className="flow-step" key={item[0]}><span className="step-number">{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small>{i<3&&<span className="connector">↓</span>}</div>)}</div>
        </div>
      </section>

      <section className="ticker" aria-label="Protocol status"><span>FACILITATOR <b>GOPLAUSIBLE</b></span><span>SCHEME <b>EXACT</b></span><span>ASSET <b>USDC · 31566704</b></span><span>PRICE <b>$0.10 / SIGNAL</b></span></section>

      <section className="workspace" id="playground">
        <div className="section-title"><div><span className="kicker">01 / SIGNAL LAB</span><h2>Ask the network.</h2></div><p>Preview the intelligence product. Preview calls never settle funds or count as leaderboard activity.</p></div>
        <div className="lab-grid">
          <form className="composer card" onSubmit={runPreview}>
            <div className="card-label"><span>RESEARCH REQUEST</span><span className="preview-tag">FREE PREVIEW</span></div>
            <label htmlFor="subject">Research subject</label><textarea id="subject" value={subject} onChange={e=>setSubject(e.target.value)} maxLength={160}/>
            <div className="form-row"><label>Intent<select value={intent} onChange={e=>setIntent(e.target.value)}><option value="creator-brief">Creator brief</option><option value="research">Research</option><option value="due-diligence">Due diligence</option></select></label><label>Freshness<select value={freshness} onChange={e=>setFreshness(e.target.value)}><option value="1h">Last hour</option><option value="24h">Last 24 hours</option><option value="7d">Last 7 days</option></select></label></div>
            <div className="quote"><span>Production quote</span><strong>$0.10 USDC</strong></div>
            <button className="run-button" aria-label="Run preview" disabled={status==='loading'}>{status==='loading'?'Scanning sources…':'Run preview'}<span aria-hidden="true">✦</span></button>{status==='error'&&<p className="error" role="alert">API unavailable. Start the local API on port 4021 and retry.</p>}
          </form>

          <article className="result-card card" id="evidence">
            <div className="card-label"><span>SIGNAL PACKET</span><span className="hash">{packet.provenance.responseHash}</span></div><h3>{packet.subject}</h3><p className="summary">{packet.summary}</p>
            <div className="signal-list">{packet.signals.map((signal,index)=><div className="signal" key={signal.claim}><div className="signal-index">0{index+1}</div><div className="signal-body"><p>{signal.claim}</p><div className="confidence"><span style={{width:`${signal.confidence*100}%`}}/><small>{Math.round(signal.confidence*100)}% confidence</small></div><div className="sources">{signal.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">↗ {source.title}</a>)}</div></div></div>)}</div>
            <footer className="packet-footer"><span>{packet.provenance.sourceCount} cited sources</span><span>Payment: <b>preview · not settled</b></span></footer>
          </article>
        </div>
      </section>

      <section className="metrics-section"><div className="metric hot"><small>SETTLED VOLUME</small><strong>$0.00</strong><span>Demo mode</span></div><div className="metric lemon"><small>PAID REQUESTS</small><strong>0</strong><span>No fake activity</span></div><div className="metric mint"><small>SOURCE COVERAGE</small><strong>{packet.provenance.sourceCount}</strong><span>Per preview packet</span></div><div className="metric lilac"><small>AVG CONFIDENCE</small><strong>{Math.round(packet.signals.reduce((a,s)=>a+s.confidence,0)/packet.signals.length*100)}%</strong><span>Evidence weighted</span></div></section>

      <section className="developers" id="developers"><div className="section-title light"><div><span className="kicker">02 / INTEGRATE</span><h2>One request. No ceremony.</h2></div><p>The same route works for scripts, agents and MCP tools. Payment middleware unlocks only after verified settlement.</p></div><div className="dev-grid"><div className="endpoint-list"><div><b>POST</b><code>/api/signals/research</code><span>$0.10</span></div><div><b>POST</b><code>/api/signals/preview</code><span>free</span></div><div><b>GET</b><code>/api/config</code><span>public</span></div></div><pre><span className="code-pink">const</span> response = <span className="code-pink">await</span> fetchWithPayment(<span className="code-yellow">'{location.origin}/api/signals/research'</span>, {'{'}
  method: <span className="code-yellow">'POST'</span>,
  body: JSON.stringify({'{'} subject: <span className="code-yellow">'Algorand x402'</span> {'}'})
{'}'});

<span className="code-pink">const</span> signal = <span className="code-pink">await</span> response.json();</pre></div></section>

      <section className="transactions"><div className="section-title"><div><span className="kicker">03 / SETTLEMENTS</span><h2>Proof, not theatre.</h2></div><span className="empty-badge">0 MAINNET TRANSACTIONS</span></div><div className="empty-state"><Flower/><div><strong>No settlements yet.</strong><p>Preview packets are intentionally excluded. Connect a merchant address and verified x402 middleware before Mainnet activity appears here.</p></div><a href="https://facilitator.goplausible.xyz/dashboard" target="_blank" rel="noreferrer">Open facilitator ↗</a></div></section>
    </main>
    <footer className="footer"><a className="brand" href="#top"><Flower/>lattice402</a><p>Machine-native intelligence, settled on Algorand.</p><span>Built for the Algorand x402 Hackathon · 2026</span></footer>
  </div>
}

export default App

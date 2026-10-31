import { useEffect, useMemo, useState } from 'react'
import { personas, questions } from './questions'

const blankAnswers = () => Array.from({ length: questions.length }, () => '')
const choose = (items) => items[Math.floor(Math.random() * items.length)]

function makeReading(answers) {
  const [padme, anakin] = [answers.padme, answers.anakin]
  const names = [padme[0] || 'Padmé', anakin[0] || 'Anakin']
  const sameColor = padme[1]?.trim().toLowerCase() === anakin[1]?.trim().toLowerCase()
  const sameSeason = padme[4] === anakin[4]
  const sameDaytime = padme[11] === anakin[11]
  const jealousy = Math.abs(Number(padme[21]) - Number(anakin[21]))
  const island = `${padme[23]} / ${anakin[23]}`
  const harmony = [sameColor && 'renk frekansları', sameSeason && 'mevsim takvimleri', sameDaytime && 'biyolojik saatleri'].filter(Boolean)
  const connection = harmony.length
    ? `${harmony.join(', ')} aynı hizaya geldi. Bu kadar senkronize olmak şüpheli derecede tatlı.`
    : 'farklı galaksilerden gelmiş gibisiniz; ama en iyi yıldız çarpışmaları da böyle başlar.'

  return {
    names,
    title: choose(['KOZMİK ORTAKLAR', 'KAOTİK İKİLİ', 'YASAKLI YILDIZLAR', 'GALAKSİNİN FAVORİ ÇİFTİ']),
    romantic: choose([
      `${names[0]} ve ${names[1]} için tarama tamamlandı: ${connection} Jedi Konseyi bu kimyayı resmî olarak "fazla ana karakter" ilan etti.`,
      `Biriniz ${padme[4]?.toLowerCase()}, diğeriniz ${anakin[4]?.toLowerCase()} enerjisi taşıyor. Sonuç: birbirinizin mevsimi olma ihtimaliniz astronomik.`,
      `Kalp radarı, bu ilişkinin normal bir buluşmayı bile sezon finaline çevirebileceğini söylüyor. Romantik mi? Fazlasıyla.`,
    ]),
    freaky: choose([
      `Laboratuvar, birlikte ıssız adaya düşme planınızı (${island}) analiz etmeyi denedi. Bilgisayar "bunu ikiniz çözün" deyip kapanmayı seçti.`,
      `Gizli veriler, birbirinizin tuhaflıklarını yalnızca tolere etmeyeceğinizi; ara sıra koleksiyonunu yapacağınızı söylüyor. Endişe verici derecede ikonik.`,
      `${names[0]} ile ${names[1]} aynı odaya girince mantığın kısa süreliğine izin aldığı tespit edildi. Bilim ekibi ara verdi.`,
    ]),
    conflict: choose([
      jealousy <= 2
        ? `Kıskançlık frekanslarınız şaşırtıcı biçimde dengeli. Gerçek tehlike: "Bana kızgın mısın?" sorusuna verilen "yok" cevabı.`
        : `Kıskançlık radarında küçük bir asteroid yağmuru var. Telaş yok; sadece birbirinizin telefonuna bakmadan önce nefes alın.`,
      `Birlikte yaşama tahmini: en büyük savaşınız ${padme[20]?.toLowerCase() || 'ev düzeni'} konusunda başlayabilir. Barış anlaşmasına atıştırmalık maddesi eklenmeli.`,
      `Sith Lordları düşük risk. Asıl düşman, mesajdaki "tamam." noktasının kaç anlam taşıdığı konusu.`,
    ]),
    future: choose([
      `Yakın gelecekte beraber gülmekten nefessiz kalacağınız bir an görünüyor. Muhtemelen çok ciddiye alınmaması gereken bir şeye güleceksiniz.`,
      `Yıldız haritası, plansız bir kaçamak ve sonradan efsaneye dönüşecek bir hikâye gösteriyor. Şarj aletini unutmayın.`,
      `Bu ikili için gelecek notu: tartışmalarınız kısa, anlatacak hikâyeleriniz çok uzun olacak.`,
    ]),
    verdict: choose([
      `Jedi Konseyi'nin nihai kararı: ${names[0]} ve ${names[1]}'in birbirinden uzak durması galaktik düzen için önerilmiyor. Aksine, birlikte kalın.`,
      `Karar açıklandı: Bu bağı evren açıklayamadı; ama destekliyor. İkinize de dikkatli şekilde iyi eğlenceler.`,
      `Kozmik mühür basıldı. Birbirinizi biraz delirtmeniz, birbirinizden vazgeçeceğiniz anlamına gelmiyor. Tam tersi.`,
    ]),
  }
}

function App() {
  const [answers, setAnswers] = useState({ padme: blankAnswers(), anakin: blankAnswers() })
  const [completed, setCompleted] = useState({ padme: false, anakin: false })
  const [screen, setScreen] = useState('home')
  const [active, setActive] = useState('padme')
  const [step, setStep] = useState(0)
  const [notice, setNotice] = useState('')
  const [reading, setReading] = useState(null)
  const [score, setScore] = useState(0)

  const activeAnswers = answers[active]
  const allDone = completed.padme && completed.anakin
  const answeredCount = activeAnswers.filter(Boolean).length
  const current = questions[step]

  const displayNames = useMemo(() => ({
    padme: answers.padme[0] || personas.padme.label,
    anakin: answers.anakin[0] || personas.anakin.label,
  }), [answers])

  useEffect(() => {
    if (screen !== 'results') return undefined
    setScore(0)
    const timer = window.setInterval(() => {
      setScore((value) => {
        if (value >= 101) {
          window.clearInterval(timer)
          return 101
        }
        return value + 1
      })
    }, 16)
    return () => window.clearInterval(timer)
  }, [screen, reading])

  const updateAnswer = (value) => {
    setAnswers((previous) => ({
      ...previous,
      [active]: previous[active].map((answer, index) => (index === step ? value : answer)),
    }))
    setNotice('')
  }

  const begin = () => {
    setActive(completed.padme ? 'anakin' : 'padme')
    setStep(0)
    setScreen('quiz')
  }

  const continueQuiz = () => {
    const isUntouchedRange = current.type === 'range' && !activeAnswers[step]
    if (!activeAnswers[step] && !isUntouchedRange) {
      setNotice('Devam etmek için bu yıldız verisini doldurmalısın.')
      return
    }
    // The visible midpoint is a valid intentional answer, even if the slider was not moved.
    if (isUntouchedRange) {
      setAnswers((previous) => ({
        ...previous,
        [active]: previous[active].map((answer, index) => (index === step ? '5' : answer)),
      }))
    }
    if (step < questions.length - 1) {
      setStep(step + 1)
      return
    }
    const nextCompleted = { ...completed, [active]: true }
    setCompleted(nextCompleted)
    if (active === 'padme') {
      setActive('anakin')
      setStep(0)
      setNotice('')
      return
    }
    setScreen('ready')
    setNotice('')
  }

  const openEditing = (person) => {
    setActive(person)
    setStep(0)
    setCompleted((previous) => ({ ...previous, [person]: false }))
    setScreen('quiz')
  }

  const launchAnalysis = () => {
    if (!allDone) return
    setReading(makeReading(answers))
    setScreen('results')
  }

  const reset = () => {
    if (!window.confirm('Tüm cevaplar ve analiz silinsin mi?')) return
    setAnswers({ padme: blankAnswers(), anakin: blankAnswers() })
    setCompleted({ padme: false, anakin: false })
    setReading(null)
    setActive('padme')
    setStep(0)
    setScreen('home')
  }

  const share = async () => {
    const text = `${reading.names[0]} & ${reading.names[1]}: Galaktik uyum %101. Jedi Konseyi onayladı. 💛`
    try {
      if (navigator.share) await navigator.share({ title: 'Galactic Compatibility Lab', text })
      else {
        await navigator.clipboard.writeText(text)
        setNotice('Galaktik sonuç panoya kopyalandı.')
      }
    } catch (error) {
      if (error.name !== 'AbortError') setNotice('Paylaşım şu an açılamadı. Bir kez daha dene.')
    }
  }

  return (
    <main className="app-shell">
      <div className="star-field" aria-hidden="true" />
      <div className="nebula nebula-one" aria-hidden="true" />
      <div className="nebula nebula-two" aria-hidden="true" />

      <header className="topbar">
        <button className="brand" onClick={() => setScreen(allDone ? 'ready' : 'home')} aria-label="Ana ekrana dön">
          <span className="brand-mark">✦</span>
          <span><b>GALACTIC</b> COMPATIBILITY LAB</span>
        </button>
        <span className="topbar-status"><i /> CANLI ANALİZ</span>
      </header>

      {screen === 'home' && (
        <section className="home-view view-enter">
          <p className="eyebrow">JEDI KONSEYİ • İLİŞKİ BİRİMİ</p>
          <h1>İki ruh.<br /><em>Bir galaksi.</em></h1>
          <p className="hero-copy">Birbirinizin cevaplarını görmeden 25 küçük kozmik soruyu yanıtlayın. Sonra laboratuvarın mantığa meydan okuyan raporunu açın.</p>
          <div className="persona-row">
            <PersonaCard person="padme" name={displayNames.padme} complete={completed.padme} onClick={() => !completed.padme && openEditing('padme')} />
            <div className="orbit-link">✦</div>
            <PersonaCard person="anakin" name={displayNames.anakin} complete={completed.anakin} locked={!completed.padme && !completed.anakin} onClick={() => completed.padme && !completed.anakin && openEditing('anakin')} />
          </div>
          <button className="button button-primary hero-cta" onClick={begin}>
            {completed.padme ? 'ANAKIN İÇİN DEVAM ET' : 'MİSYONU BAŞLAT'} <span>→</span>
          </button>
          <p className="fine-print">Bilimsellik seviyesi: şüpheli. Eğlence seviyesi: endişe verici derecede yüksek.</p>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="quiz-view view-enter">
          <div className="quiz-topline">
            <button className="text-button" onClick={() => setScreen('home')}>← Çıkış</button>
            <span>GİZLİ CEVAP MODU <i className="privacy-dot" /></span>
          </div>
          <div className="answering-for">
            <span className={`persona-dot ${personas[active].accent}`}>{personas[active].emoji}</span>
            <div><p>{personas[active].label} CEVAPLIYOR</p><b>Diğer yolcu bu verileri göremiyor.</b></div>
          </div>
          <div className="progress-meta"><span>SORU {step + 1} / {questions.length}</span><span>{answeredCount} veri alındı</span></div>
          <div className="progress-track"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
          <article className="question-panel">
            <p className="category-label">{current.category}</p>
            <h2>{current.prompt}</h2>
            <AnswerInput question={current} value={activeAnswers[step]} onChange={updateAnswer} />
            {notice && <p className="validation-message">✦ {notice}</p>}
          </article>
          <div className="quiz-actions">
            <button className="button button-ghost" onClick={() => step ? setStep(step - 1) : setScreen('home')}>
              {step ? '← GERİ' : '← VAZGEÇ'}
            </button>
            <button className="button button-primary" onClick={continueQuiz}>
              {step === questions.length - 1 ? (active === 'padme' ? 'CEVAPLARI MÜHÜRLE' : 'TAMAMLA') : 'DEVAM ET →'}
            </button>
          </div>
          <button className="jump-link" onClick={() => setStep(Math.min(questions.length - 1, step + 1))}>Bu soruyu sonra yanıtla</button>
        </section>
      )}

      {screen === 'ready' && (
        <section className="ready-view view-enter">
          <p className="eyebrow">VERİ SENKRONİZASYONU TAMAMLANDI</p>
          <div className="scan-icon">✦</div>
          <h1>İki dosya da<br /><em>mühürlendi.</em></h1>
          <p className="hero-copy">{displayNames.padme} ve {displayNames.anakin}, cevaplarınız ilk kez şimdi aynı yıldız haritasında buluşuyor.</p>
          <div className="completion-cards">
            <ReviewCard person="padme" name={displayNames.padme} onEdit={() => openEditing('padme')} />
            <ReviewCard person="anakin" name={displayNames.anakin} onEdit={() => openEditing('anakin')} />
          </div>
          <button className="button button-primary analyze-button" onClick={launchAnalysis}>GALAKTİK ANALİZİ BAŞLAT <span>✦</span></button>
          <button className="reset-link" onClick={reset}>Tüm verileri sıfırla</button>
        </section>
      )}

      {screen === 'results' && reading && (
        <section className="results-view view-enter">
          <p className="eyebrow">KONSEY RAPORU • SINIFLANDIRMA: İKONİK</p>
          <div className="score-orbit"><div className="score-inner"><small>UYUM ORANINIZ</small><strong>%{score}</strong><span>matematik itiraz etti</span></div></div>
          <div className="result-heading"><p>{reading.title}</p><h1>{reading.names[0]} <span>&</span> {reading.names[1]}</h1></div>
          <div className="analysis-grid">
            <ResultCard icon="♡" label="ROMANTİK ANALİZ" text={reading.romantic} index={0} />
            <ResultCard icon="☄" label="FREAKY BULGULAR" text={reading.freaky} index={1} />
            <ResultCard icon="⚡" label="KAVGA POTANSİYELİ" text={reading.conflict} index={2} />
            <ResultCard icon="◌" label="GELECEK TAHMİNİ" text={reading.future} index={3} />
          </div>
          <article className="verdict-card"><p>GALAKTİK İLİŞKİNİN NİHAİ KARARI</p><h2>{reading.verdict}</h2></article>
          <div className="love-banner"><span>✦</span><strong>ANAKIN & PADMÉ’NİN AŞKINI GEÇTİNİZ.</strong><span>✦</span><p>Galaksinin kaderi artık sizin ellerinizde. 💛</p></div>
          {notice && <p className="share-message">{notice}</p>}
          <div className="result-actions"><button className="button button-ghost" onClick={share}>SONUÇLARI PAYLAŞ ↗</button><button className="button button-primary" onClick={launchAnalysis}>ANALİZİ TEKRARLA ✦</button></div>
          <button className="reset-link" onClick={reset}>Yeni bir ikili için laboratuvarı sıfırla</button>
        </section>
      )}
      <footer>BU RAPOR TAMAMEN EĞLENCE AMAÇLIDIR • JEDI KONSEYİ SORUMLULUK KABUL ETMEZ</footer>
    </main>
  )
}

function PersonaCard({ person, name, complete, locked, onClick }) {
  const data = personas[person]
  return <button className={`persona-card ${data.accent} ${complete ? 'is-complete' : ''}`} onClick={onClick} disabled={locked}>
    <span className="persona-icon">{complete ? '✓' : data.emoji}</span>
    <span className="persona-content"><small>{data.label}</small><strong>{name}</strong><em>{complete ? 'VERİLER MÜHÜRLENDİ' : locked ? 'ÖNCE PADMÉ' : data.role}</em></span>
    {!locked && <span className="card-arrow">{complete ? '✓' : '→'}</span>}
  </button>
}

function ReviewCard({ person, name, onEdit }) {
  const data = personas[person]
  return <div className={`review-card ${data.accent}`}><span>{data.emoji}</span><div><small>{data.label}</small><b>{name}</b><em>25 / 25 veri koruma altında</em></div><button onClick={onEdit} aria-label={`${name} cevaplarını düzenle`}>Düzenle</button></div>
}

function AnswerInput({ question, value, onChange }) {
  if (question.type === 'choice') return <div className="choice-grid">{question.options.map((option) => <button key={option} className={`choice-button ${value === option ? 'selected' : ''}`} onClick={() => onChange(option)}>{option}<span>{value === option ? '✓' : ''}</span></button>)}</div>
  if (question.type === 'range') return <div className="range-wrap"><div className="range-number">{value || 5}<small>/10</small></div><input type="range" min="1" max="10" value={value || 5} onChange={(event) => onChange(event.target.value)} /><div className="range-labels"><span>Ben mi? Asla.</span><span>İmparatorluk seviyesi</span></div></div>
  return <input className="answer-input" type={question.type} value={value} placeholder={question.placeholder} onChange={(event) => onChange(event.target.value)} autoFocus />
}

function ResultCard({ icon, label, text, index }) {
  return <article className="result-card" style={{ animationDelay: `${index * 110 + 250}ms` }}><span className="result-icon">{icon}</span><p>{label}</p><h3>{text}</h3></article>
}

export default App

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css'
import { loadFont, loadFontFromPath } from './font';
import type { FontMetadata } from './types';
import { Impressum } from './legal/Impressum';
import { Datenschutz } from './legal/Datenschutz';

type Route = 'home' | 'impressum' | 'datenschutz'

function getRouteFromHash(): Route {
  if (typeof window === 'undefined') return 'home'
  const h = window.location.hash
  if (h === '#/impressum') return 'impressum'
  if (h === '#/datenschutz') return 'datenschutz'
  return 'home'
}

const SAMPLE_TEXTS = [
  'The quick brown fox jumps over the lazy dog bodo.',
]

type ExampleFont = {
  name: string
  fontFamily: string
  fileName: string
  url: string
}

const EXAMPLE_FONTS: ExampleFont[] = [
  { name: 'Thold', fontFamily: 'Thold-Regular', fileName: 'Thold-Regular.otf', url: '/example_fonts/Thold-Regular.otf' },
  { name: 'Struggle', fontFamily: 'struggle-regular', fileName: 'struggle-regular.otf', url: '/example_fonts/struggle-regular.otf' },
]

function App() {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [metadata, setMetadata] = useState<FontMetadata | null>(null)
  const [familyId, setFamilyId] = useState<string>('')
  const [activeExampleUrl, setActiveExampleUrl] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const previewInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [text, setText] = useState(SAMPLE_TEXTS[0])
  const [fontSize, setFontSize] = useState(72)
  const [lineHeight, setLineHeight] = useState(1.2)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [wordSpacing, setWordSpacing] = useState(0)
  const [color, setColor] = useState('#f4a4c0')
  const [bgColor, setBgColor] = useState('#0056d6')

  const [route, setRoute] = useState<Route>(() => getRouteFromHash())
  const isLegal = route !== 'home'

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleFile = async (file: File) => {
    setError(null)
    setIsLoading(true)
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'otf' && ext !== 'ttf') {
      setError('Only OTF and TTF font files are supported.')
      setIsLoading(false)
      return
    }

    try {
      const id = `user-font-${Date.now()}`
      const { metadata } = await loadFont(file, id)
      setMetadata(metadata)
      setFamilyId(id)
      setActiveExampleUrl(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Font could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleFont = async (example: ExampleFont) => {
    setError(null)
    setIsLoading(true)
    try {
      const id = `example-font-${Date.now()}`
      const { metadata } = await loadFontFromPath(example.url, example.fileName, id)
      setMetadata(metadata)
      setFamilyId(id)
      setActiveExampleUrl(example.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Font could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }

  // focus textarea + put caret at end whenever a new font loads
  // so user sees blinking cursor
  useEffect(() => {
    if (!familyId) return
    const ta = textareaRef.current
    if (!ta) return
    ta.focus()
    const end = ta.value.length
    ta.setSelectionRange(end, end)
  }, [familyId])

  useEffect(() => {
  const onWindowDrop = (e: DragEvent) => e.preventDefault()
  const onWindowDragOver = (e: DragEvent) => e.preventDefault()
  window.addEventListener('drop', onWindowDrop)
  window.addEventListener('dragover', onWindowDragOver)
  return () => {
    window.removeEventListener('drop', onWindowDrop)
    window.removeEventListener('dragover', onWindowDragOver)
  }
  }, [])

  return (
    <div className='min-h-full flex flex-col'>
      {(metadata || isLegal) && (
        <header className='border-b border-neutral-800 px-6 py-4 flex items-center justify-between gap-4'>
          <div>
            <h1
              className='font-semibold tracking-tight'
              style={{ fontFamily: '"Thold-Regular", ui-sans-serif, system-ui, sans-serif', fontSize: '2.5rem', lineHeight: 1 }}
            >
              <a href="." className="hover:text-[#d4ff00] transition">fontend</a>
            </h1>
            <p className='text-xs text-neutral-400 mt-1'>A font tester - everything lives in your browser, nothing is stored</p>
          </div>
          {metadata && !isLegal && (
            <>
              <input
                ref={previewInputRef}
                type="file"
                accept=".otf,.ttf,font/otf,font/ttf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                  e.target.value = ''
                }}
              />
              <button
                onClick={() => previewInputRef.current?.click()}
                disabled={isLoading}
                className="text-xs px-3 py-2 rounded border border-neutral-700 hover:border-[#d4ff00] hover:text-[#d4ff00] text-neutral-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span aria-hidden>↑</span>
                {isLoading ? 'Loading...' : 'Upload font'}
              </button>
            </>
          )}
        </header>
      )}

      {/* legal pages take precedence - keep app state intact behind them */}
      {route === 'impressum' ? <Impressum /> :
       route === 'datenschutz' ? <Datenschutz /> :
       metadata ?  (
        // --------- FONT PREVIEW PAGE ---------
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] min-h-0">
          {/* --------- SIDEBAR WITH SLIDERS ETC --------- */}
          <aside className="border-r border-neutral-800 p-5 space-y-5 overflow-y-auto">
            <div>
              <label className="block text-[0.6rem] uppercase tracking-[0.2em] text-neutral-400 mb-2">Sample fonts</label>
              <div className="flex flex-col gap-1.5">
                {EXAMPLE_FONTS.map((ex) => {
                  const active = activeExampleUrl === ex.url
                  return (
                    <button
                      key={ex.url}
                      disabled={isLoading}
                      onClick={() => handleExampleFont(ex)}
                      className={`text-left text-xs px-2 py-1.5 rounded border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                        active
                          ? 'border-[#d4ff00] bg-[#d4ff00]/10 text-neutral-100'
                          : 'border-neutral-800 hover:border-neutral-600 text-neutral-300'
                      }`}
                      style={{ fontFamily: ex.fontFamily}}
                    >
                      {ex.name}
                    </button>
                  )
                })}
              </div>
              {error && <div className="mt-2 text-[11px] text-red-400">{error}</div>}
            </div>

            <Slider label="Font size" value={fontSize} min={8} max={400} step={1} unit="px" onChange={setFontSize} />
            <Slider label="Line height" value={lineHeight} min={0.5} max={3} step={0.05} onChange={setLineHeight} />
            <Slider label="Letter spacing" value={letterSpacing} min={-20} max={50} step={0.1} unit="px" onChange={setLetterSpacing} />
            <Slider label="Word spacing" value={wordSpacing} min={-20} max={100} step={0.5} unit="px" onChange={setWordSpacing} />

            <div>
              <label className="block text-[0.6rem] uppercase tracking-[0.2em] text-neutral-400 mb-2">Font color</label>
              <ColorRow value={color} onChange={setColor} />
            </div>
            <div>
              <label className="block text-[0.6rem] uppercase tracking-[0.2em] text-neutral-400 mb-2">Background</label>
              <ColorRow value={bgColor} onChange={setBgColor} />
            </div>

            <div>
              <label className="block text-[0.6rem] uppercase tracking-[0.2em] text-neutral-400 mb-2">Sample text</label>
              <div className="flex flex-col gap-1">
                {SAMPLE_TEXTS.map((s, i) => (
                  <button
                    key={i}
                    className="text-left text-xs text-neutral-400 hover:text-neutral-100 truncate"
                    onClick={() => setText(s)}
                  >
                    # {s.split('\n')[0]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* // --------- MAIN VIEW WITH TEXTAREA --------- */}
          <main className="flex flex-col min-h-0">
            <div className="border-b border-neutral-800 px-6 py-3 flex items-center gap-3">
              <div className="text-[0.6rem] uppercase tracking-wider text-neutral-500 shrink-0">Current font</div>
              <div className="text-sm font-medium text-neutral-100 truncate">
                {metadata.fontFamily ?? metadata.fileName}
              </div>
              {metadata.fontFamily && (
                <div className="text-[11px] text-neutral-500 truncate">{metadata.fileName}</div>
              )}

              {/* INFO BUTTON / ICON */}
              <div className="ml-auto relative group shrink-0">
                <button
                  type="button"
                  aria-label="How to use"
                  className="w-4 h-4 rounded-full border border-neutral-700 text-[10px] text-neutral-400 hover:border-[#d4ff00] hover:text-[#d4ff00] flex items-center justify-center transition"
                >
                  i
                </button>
                <div className="pointer-events-none absolute right-0 top-full mt-2 w-64 rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition shadow-lg z-10">
                  Click anywhere in the text area and type to try the font with your own words.
                </div>
              </div>
            </div>
            {/* // --------- FONT TEXTAREA --------- */}
            <div
              className="flex-1 overflow-auto p-10"
              style={{ background: bgColor }}
              onClick={() => textareaRef.current?.focus()}
            >
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                autoFocus
                className="w-full h-full bg-transparent border-0 outline-none resize-none whitespace-pre-wrap break-words caret-current"
                style={{
                  fontFamily: familyId ? `"${familyId}"` : undefined,
                  fontSize: `${fontSize}px`,
                  lineHeight,
                  letterSpacing: `${letterSpacing}px`,
                  wordSpacing: `${wordSpacing}px`,
                  color,
                }}
              />
            </div>
          </main>

          {/* // --------- META DATA LIST --------- */}
          <aside className="border-l border-neutral-800 p-5 overflow-y-auto text-sm">
            <h2 className="text-[0.6rem] uppercase tracking-[0.2em] text-neutral-400 mb-3">Metadata</h2>
            <MetadataList metadata={metadata} />
          </aside>
        </div>
        ) : (
          // --------- LANDING!!! ---------
          <div className="flex-1 flex flex-col min-h-0">
            {/* HERO: huge title left, drop zone right */}
            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] flex-1 min-h-0">
              <div className="flex flex-col justify-center px-6 md:px-12 py-10 border-b md:border-b-0 md:border-r border-neutral-800">
                <h2
                  className="font-bold leading-[0.85] tracking-tight"
                  style={{
                    fontFamily: '"Thold-Regular", ui-sans-serif, system-ui, sans-serif',
                    fontSize: 'clamp(4rem, 13vw, 11rem)',
                  }}
                >
                  fontend
                </h2>
                <p className="mt-6 text-sm md:text-base text-neutral-400 max-w-md">
                  Drop a font, see how it really looks. Sliders, colors, sample text - all in your browser, nothing stored anywhere.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-neutral-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#d4ff00]" />
                  Local & private
                </div>
              </div>

              {/* DROP ZONE ON THE RIGHT */}
              <label
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`relative flex flex-col items-center justify-center text-center px-6 py-10 cursor-pointer transition ${
                  isDragging
                    ? 'bg-[#d4ff00]/10'
                    : 'hover:bg-neutral-900'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".otf,.ttf,font/otf,font/ttf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                  }}
                />
                <div
                  className="text-3xl md:text-4xl font-medium leading-tight"
                  style={{ fontFamily: '"Thold-Regular", ui-sans-serif, sans-serif' }}
                >
                  {isLoading ? 'Loading...' : (
                    <>Drop a <span className="text-[#d4ff00]">font here ↑</span></>
                  )}
                </div>
                <div className="mt-3 text-xs text-neutral-500 uppercase tracking-[0.2em]">
                  OTF / TTF - or click to select
                </div>
                {error && <div className="mt-4 text-xs text-red-400 max-w-xs">{error}</div>}
              </label>
            </div>

            {/* EXAMPLE FONT ROWS */}
            <div className="border-t border-neutral-800">
              <div className="px-6 md:px-12 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-neutral-500">
                Or try a sample
              </div>
              {EXAMPLE_FONTS.map((ex) => (
                <button
                  key={ex.url}
                  disabled={isLoading}
                  onClick={() => handleExampleFont(ex)}
                  className="group w-full flex items-center justify-between gap-6 border-t border-neutral-800 px-6 md:px-12 py-3 md:py-4 text-left transition hover:bg-[#d4ff00]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span
                    className="text-3xl md:text-5xl text-neutral-200 group-hover:text-[#d4ff00] transition truncate"
                    style={{ fontFamily: ex.fontFamily }}
                  >
                    {ex.name}
                  </span>
                  <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.2em] text-neutral-500 group-hover:text-[#d4ff00] transition flex items-center gap-2">
                    Try
                    <span aria-hidden className="text-base">→</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      }

      <footer className="border-t border-neutral-800 px-6 md:px-12 py-4 text-xs text-neutral-500 flex items-center justify-between">
        <div>© {new Date().getFullYear()} fontend</div>
        <nav className="flex items-center gap-4">
          <a href="#/impressum" className="hover:text-[#d4ff00] transition">Impressum / Imprint</a>
          <a href="#/datenschutz" className="hover:text-[#d4ff00] transition">Datenschutz / Privacy Policy</a>
        </nav>
      </footer>
    </div>
  )
}

function Slider({
  label, value, min, max, step, unit, onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[0.6rem] uppercase tracking-[0.2em] text-neutral-400">{label}</label>
        <span className="text-xs tabular-nums text-neutral-300">
          {value}{unit ?? ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#d4ff00]"
      />
    </div>
  )
}

function ColorRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-9 h-9 rounded bg-transparent border border-neutral-700 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs font-mono"
      />
    </div>
  )
}

function MetadataList({ metadata }: { metadata: FontMetadata }) {
  const rows: Array<[string, string | number | undefined]> = [
    ['Family', metadata.fontFamily],
    ['Subfamily', metadata.fontSubfamily],
    ['Full name', metadata.fullName],
    ['Format', metadata.format],
    ['Version', metadata.version],
    ['Glyphs', metadata.numGlyphs],
    ['Designer', metadata.designer],
    ['Designer URL', metadata.designerURL],
    ['Manufacturer', metadata.manufacturer],
    ['Manufacturer URL', metadata.manufacturerURL],
    ['Copyright', metadata.copyright],
    ['Trademark', metadata.trademark],
    ['License', metadata.license],
    ['License URL', metadata.licenseURL],
    ['Description', metadata.description],
    ['Unique ID', metadata.uniqueID],
  ]
  return (
    <dl className="space-y-2">
      {rows
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => (
          <div key={k}>
            <dt className="text-[0.6rem] uppercase tracking-wider text-neutral-400">{k}</dt>
            <dd><CollapsibleValue value={String(v)} /></dd>
          </div>
        ))}
    </dl>
  )
}

function CollapsibleValue({ value, clampLines = 3 }: { value: string; clampLines?: number }) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // measure in clamped state - once we know it overflows, the toggle stays available
    const wasExpanded = expanded
    if (wasExpanded) return
    setOverflows(el.scrollHeight > el.clientHeight + 1)
  }, [value, expanded])

  return (
    <div>
      <div
        ref={ref}
        className="text-xs text-neutral-200 wrap-break-word whitespace-pre-wrap"
        style={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: clampLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
      >
        {value}
      </div>
      {overflows && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-[#d4ff00]/80 hover:text-[#d4ff00]"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

export default App

import { useEffect, useRef, useState } from 'react';
import './App.css'
import { loadFont } from './font';
import type { FontMetadata } from './types';

const SAMPLE_TEXTS = [
  'The quick brown fox jumps over the lazy dog bodo.',
]

function App() {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [metadata, setMetadata] = useState<FontMetadata | null>(null)
  const [familyId, setFamilyId] = useState<string>('')

  const inputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState(SAMPLE_TEXTS[0])
  const [fontSize, setFontSize] = useState(72)
  const [lineHeight, setLineHeight] = useState(1.2)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [wordSpacing, setWordSpacing] = useState(0)
  const [color, setColor] = useState('#f4a4c0')
  const [bgColor, setBgColor] = useState('#0056d6')

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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Font could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }

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
      <header className='border-b border-neutral-800 px-6 py-4 flex items-center justify-between'>
        <div>
          <h1 className='text-lg font-semibold tracking-tight'>fontend</h1>
          <p className='text-xs text-neutral-400'>A font tester - everything lives in your browser, nothing is saved</p>
        </div>
      </header>

      {/* show font preview OR drag drap zone */}
      {metadata ?  (
        // --------- FONT PREVIEW ---------
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] min-h-0">
          <aside className="border-r border-neutral-800 p-5 space-y-5 overflow-y-auto">
            <Slider label="Font size" value={fontSize} min={8} max={400} step={1} unit="px" onChange={setFontSize} />
            <Slider label="Line height" value={lineHeight} min={0.5} max={3} step={0.05} onChange={setLineHeight} />
            <Slider label="Letter spacing" value={letterSpacing} min={-20} max={50} step={0.1} unit="px" onChange={setLetterSpacing} />
            <Slider label="Word spacing" value={wordSpacing} min={-20} max={100} step={0.5} unit="px" onChange={setWordSpacing} />

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Font color</label>
              <ColorRow value={color} onChange={setColor} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Background</label>
              <ColorRow value={bgColor} onChange={setBgColor} />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Sample text</label>
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

          <main className="flex flex-col min-h-0">
            <div
              className="flex-1 overflow-auto p-10"
              style={{ background: bgColor }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setText((e.target as HTMLDivElement).innerText)}
                className="outline-none whitespace-pre-wrap wrap-break-word"
                style={{
                  fontFamily: familyId ? `"${familyId}"` : undefined,
                  fontSize: `${fontSize}px`,
                  lineHeight,
                  letterSpacing: `${letterSpacing}px`,
                  wordSpacing: `${wordSpacing}px`,
                  color,
                }}
              >
                {text}
              </div>
            </div>
          </main>

          {/* meta data list */}
          <aside className="border-l border-neutral-800 p-5 overflow-y-auto text-sm">
            <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-3">Metadata</h2>
            <MetadataList metadata={metadata} />
          </aside>
        </div>
        ) : (
          // --------- DRAG DROP ZONE ---------
          <div className="flex-1 flex items-center justify-center p-6">
            <label
              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-neutral-700 hover:border-neutral-400'
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
              <div className="text-2xl font-medium mb-2">
                {isLoading ? 'Loading…' : 'Drop OTF / TTF here'}
              </div>
              <div className="text-sm text-neutral-400">or click to select</div>
              {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
            </label>
          </div>
        )
      }
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
        <label className="text-xs uppercase tracking-wider text-neutral-400">{label}</label>
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
        className="w-full accent-blue-500"
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
            <dt className="text-[10px] uppercase tracking-wider text-neutral-400">{k}</dt>
            <dd className="text-xs text-neutral-200 wrap-break-word">{String(v)}</dd>
          </div>
        ))}
    </dl>
  )
}

export default App

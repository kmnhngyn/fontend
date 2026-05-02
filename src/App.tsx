import { useEffect, useRef, useState } from 'react';
import './App.css'
import { loadFont } from './font';
import type { FontMetadata } from './types';

function App() {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [metadata, setMetadata] = useState<FontMetadata | null>(null)
  const [familyId, setFamilyId] = useState<string>('')

  const inputRef = useRef<HTMLInputElement>(null)

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
        <div>
          <div
            contentEditable
            suppressContentEditableWarning
            className="outline-none whitespace-pre-wrap break-words"
            style={{
              fontFamily: familyId ? `"${familyId}"` : undefined
            }}
          >Helllllllo wooorrrllddd!</div>

          {/* // --------- FONT METADATA --------- */}
          <div>Metadata:</div>
          <div>
            <ul>
              <li>File Name: {metadata.fileName}</li>
              <li>Format: {metadata.format}</li>
              <li>Font Family: {metadata.fontFamily}</li>
              <li>Font Subfamily: {metadata.fontSubfamily}</li>
              <li>Full Name: {metadata.fullName}</li>
              <li>Version: {metadata.version}</li>
            </ul>
          </div>
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
                  : 'border-neutral-700 hover:border-neutral-500'
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
              <div className="text-sm text-neutral-500">or click to select</div>
              {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
            </label>
          </div>
        )
      }
    </div>    
  )
}

export default App

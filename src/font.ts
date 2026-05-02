import { parse as parseFont } from 'opentype.js'
import type { FontMetadata } from './types'

// opentype.js >= 1.3 nests names by platform: { unicode, macintosh, windows }
// each platform holds keys like fontFamily -> { en: "...", de: "..." }
type LangMap = Record<string, string>
type PlatformNames = Record<string, LangMap>
type FontNames = { unicode?: PlatformNames; macintosh?: PlatformNames; windows?: PlatformNames } & PlatformNames

const handleName = (names: FontNames | undefined, key: string): string | undefined => {
  if (!names) return undefined

  const platforms: Array<PlatformNames | undefined> = [names.windows, names.macintosh, names.unicode]
  for (const platform of platforms) {
    const entry = platform?.[key]
    if (entry && typeof entry === 'object') {
      return entry.en ?? Object.values(entry)[0]
    }
  }

  // fallback for older/flat shapes
  const flat = (names as PlatformNames)[key]
  if (flat && typeof flat === 'object') {
    return flat.en ?? Object.values(flat)[0]
  }
  return undefined
}

export async function loadFont(
  file: File,
  familyId: string,
): Promise<{ metadata: FontMetadata; fontFace: FontFace }> {
    /* browser returns a file object that lives in memory
    ** file.arrayBuffer() reads the bytes in ArrayBuffer
    ** new FontFace(familyId, buffer) creates a FontFace object
    ** document.fonts.add(fontFace) registers the font face with the CSSFontFaceSet of the document -> a browser API that lives in RAM
    ** react has only the metadata and familyId in state (the string name to reference the font in CSS)
    */
    const buffer = await file.arrayBuffer()
    return loadFontFromBuffer(buffer, file.name, familyId)
}

export async function loadFontFromPath(
  url: string,
  fileName: string,
  familyId: string,
): Promise<{ metadata: FontMetadata; fontFace: FontFace }> {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Could not fetch font: ${res.status}`)
    const buffer = await res.arrayBuffer()
    return loadFontFromBuffer(buffer, fileName, familyId)
}

async function loadFontFromBuffer(
  buffer: ArrayBuffer,
  fileName: string,
  familyId: string,
): Promise<{ metadata: FontMetadata; fontFace: FontFace }> {
    const font = parseFont(buffer)

    const names = font.names as unknown as FontNames
    const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
    const format = ext === 'otf' ? 'OpenType (OTF)' : ext === 'ttf' ? 'TrueType (TTF)' : ext.toUpperCase()

    // meta data that could be relevant
    const metadata: FontMetadata = {
      fileName,
      format,
      fontFamily: handleName(names, 'fontFamily'),
      fontSubfamily: handleName(names, 'fontSubfamily'),
      fullName: handleName(names, 'fullName'),
      version: handleName(names, 'version'),
      designer: handleName(names, 'designer'),
      designerURL: handleName(names, 'designerURL'),
      manufacturer: handleName(names, 'manufacturer'),
      manufacturerURL: handleName(names, 'manufacturerURL'),
      copyright: handleName(names, 'copyright'),
      license: handleName(names, 'license'),
      licenseURL: handleName(names, 'licenseURL'),
      trademark: handleName(names, 'trademark'),
      description: handleName(names, 'description'),
      uniqueID: handleName(names, 'uniqueID'),
      numGlyphs: font.glyphs?.length,
    }

    const fontFace = new FontFace(familyId, buffer)
    await fontFace.load()
    document.fonts.add(fontFace)

    return { metadata, fontFace }
}
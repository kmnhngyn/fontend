import { parse as parseFont } from 'opentype.js'
import type { FontMetadata } from './types'

// handle the metadata key names of the font e.g. fontFamily, license etc.
// these are called names (a bit confusing lol)
const handleName = (names: Record<string, Record<string, string>> | undefined, key: string): string | undefined => {
  if (!names || !names[key]) return undefined

  const entry = names[key]

  return entry.en ?? Object.values(entry)[0]
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
    const font = parseFont(buffer)

    const names = font.names as unknown as Record<string, Record<string, string>>
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const format = ext === 'otf' ? 'OpenType (OTF)' : ext === 'ttf' ? 'TrueType (TTF)' : ext.toUpperCase()

    // meta data that could be relevant
    const metadata: FontMetadata = {
      fileName: file.name,
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
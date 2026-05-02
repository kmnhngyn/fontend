// see what metadata is available: https://github.com/opentypejs/opentype.js/blob/master/src/font.mjs

export type FontMetadata = {
  fileName: string
  format: string
  fontFamily?: string
  fontSubfamily?: string
  fullName?: string
  version?: string
  designer?: string
  designerURL?: string
  manufacturer?: string
  manufacturerURL?: string
  copyright?: string
  license?: string
  licenseURL?: string
  trademark?: string
  description?: string
  uniqueID?: string
  numGlyphs?: number
}
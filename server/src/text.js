// Turn text into a plain form that's easy to compare:
// lowercase letters and digits only, everything else removed.
//
//   "Iron-Lantern"         -> "ironlantern"
//   "I r o n . L a n t"    -> "ironlant"
//   "ＩＲＯＮ" (wide letters) -> "iron"   (NFKC turns look-alike forms into normal letters)
//
// Used by the Level 4 filter AND by the guess check, so both treat text the same way.
export function normalise(text) {
  return text.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]/g, "");
}

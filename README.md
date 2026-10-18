# Next Span app prototype

Clickable, mobile-first prototype for Next Span, a design-studio concept: a rebate for reusing timber from removed houses, locked when a batch is listed and released when a buyer accepts it.

Prototype only. All amounts and data are illustrative. Generic framework, not an official council or government service.

## Run

```bash
npm install
npm run dev
```

Static build: `npm run build` (output in `dist/`, hash routes, works on any static host).

## Screens

| Route | Screen |
|---|---|
| `#/` | Entry |
| `#/estimate` | 1 Rebate estimate |
| `#/checklist` | 2 Checklist |
| `#/grade` | 3 Grade on site |
| `#/listing` | 4 Batch and listing |
| `#/search` | 5 Stock search |
| `#/batch/NS-0412` | 6 Batch page (`?m=03`, `07`, `15`, `21` highlights a scanned member) |
| `#/accept` | 7 Accept on delivery |
| `#/certificates` | 8 Certificates |

## iOS (SwiftUI)

Native version of the same eight screens, following iOS conventions (large titles, grouped lists, system controls, Liquid Glass buttons, SF Pro) with the Next Span colours and grade badges. Source in `ios/`.

```bash
cd ios
xcodegen generate
xcodebuild -project NextSpan.xcodeproj -scheme NextSpan -destination 'generic/platform=iOS Simulator' -derivedDataPath build build
```

Requires Xcode 26 or later (iOS 26 SDK). `ios/scripts/shoot.mjs` captures the screenshots in `ios/screenshots/` from a simulator whose UDID is stored in `ios/.sim-udid`.

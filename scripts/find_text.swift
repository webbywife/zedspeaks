// Prints "<file>\t<text>" for every image where macOS finds readable text (letters, logos with words).
// Uses Apple's built-in Vision framework: local, nothing to install.
//   swift scripts/find_text.swift a.png b.png ...
import Foundation
import Vision

for path in CommandLine.arguments.dropFirst() {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = false
    let handler = VNImageRequestHandler(url: URL(fileURLWithPath: path))
    try? handler.perform([request])
    let words = (request.results ?? [])
        .compactMap { $0.topCandidates(1).first }
        .filter { $0.confidence > 0.4 && $0.string.trimmingCharacters(in: .whitespaces).count >= 2 }
        .map { $0.string }
    if !words.isEmpty { print("\(path)\t\(words.joined(separator: " | "))") }
}

import SwiftUI

/// Numbered steps joined by a line, as in Claim Handbook Part 1.
struct StepBar: View {
    let steps: [String]
    let current: Int

    var body: some View {
        HStack(alignment: .top, spacing: 0) {
            ForEach(Array(steps.enumerated()), id: \.offset) { i, step in
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 0) {
                        Text(String(format: "%02d", i + 1))
                            .font(.caption.weight(.bold).monospacedDigit())
                            .foregroundStyle(i <= current ? Color.white : Color.nsInk)
                            .frame(width: 28, height: 28)
                            .background(i <= current ? Color.nsInkFixed : Color.clear)
                            .overlay(Rectangle().stroke(Color.nsInk, lineWidth: 1))
                        if i < steps.count - 1 {
                            Rectangle().fill(Color.nsInk).frame(height: 1)
                        }
                    }
                    Text(step)
                        .font(.caption2.weight(i == current ? .bold : .regular))
                        .foregroundStyle(i == current ? .primary : .secondary)
                        .fixedSize(horizontal: false, vertical: true)
                        .padding(.trailing, 4)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Step \(current + 1) of \(steps.count): \(steps[current])")
    }
}

import SwiftUI

// Brand colours from brand/tokens.json. Grade, rebate and status colours are fixed;
// ink adapts so text and tints stay legible in dark mode.
extension Color {
    init(hex: UInt32) {
        self.init(
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255
        )
    }

    static let nsInk = Color(uiColor: UIColor { $0.userInterfaceStyle == .dark ? .white : UIColor(red: 0x11 / 255, green: 0x11 / 255, blue: 0x11 / 255, alpha: 1) })
    static let nsInkFixed = Color(hex: 0x111111)
    static let nsStone = Color(hex: 0x8A8780)
    static let nsLine = Color(hex: 0xCFCBC3)
    static let nsGradeA = Color(hex: 0x1E5AA8)
    static let nsGradeB = Color(hex: 0x2E8B6E)
    static let nsGradeC = Color(hex: 0xE8A33D)
    static let nsGradeD = Color(hex: 0x2B2B2B)
    static let nsRejected = Color(hex: 0xC8401E)
    static let nsRebate = Color(hex: 0xB8651B)
    static let nsLogoYellow = Color(hex: 0xFFCC00)
}

enum Side {
    case developer, specifier

    var tint: Color { self == .developer ? .nsInk : .nsGradeA }
    var title: String { self == .developer ? "Developer" : "Specifier" }
}

enum Grade: String, CaseIterable, Identifiable {
    case A, B, C, D
    var id: String { rawValue }

    var color: Color {
        switch self {
        case .A: .nsGradeA
        case .B: .nsGradeB
        case .C: .nsGradeC
        case .D: .nsGradeD
        }
    }

    var letterColor: Color { self == .C ? .nsInkFixed : .white }

    var name: String {
        switch self {
        case .A: "Structural candidate"
        case .B: "Direct reuse"
        case .C: "Remake"
        case .D: "Recycle only"
        }
    }

    var next: Grade {
        switch self {
        case .A: .B
        case .B: .C
        case .C, .D: .D
        }
    }
}

extension View {
    /// Big numbers (batch id, sizes, counts) scale with Dynamic Type from a large-title base.
    func displayNumber(_ size: CGFloat = 44) -> some View {
        font(.system(size: size, weight: .bold).monospacedDigit())
    }
}

/// Small square status tag, a brand element (square on purpose).
struct StatusTag: View {
    enum Kind { case neutral, rebate, ready, quote, rejected }
    let text: String
    var kind: Kind = .neutral

    private var mark: Color {
        switch kind {
        case .neutral: .nsInk
        case .rebate: .nsRebate
        case .ready: .nsGradeB
        case .quote: .nsStone
        case .rejected: .nsRejected
        }
    }

    var body: some View {
        HStack(spacing: 6) {
            Rectangle().fill(mark).frame(width: 8, height: 8)
            Text(text.uppercased())
                .font(.caption.weight(.bold))
                .tracking(0.6)
                .foregroundStyle(Color.nsInk)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .overlay(Rectangle().stroke(Color.nsInk, lineWidth: 1))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Status: \(text)")
    }
}

/// "$ XXX" followed by a small "illustrative" note, as the spec requires everywhere.
struct Money: View {
    var value = DemoData.money
    var font: Font = .title2.weight(.bold)
    var stacked = false

    var body: some View {
        let layout = stacked ? AnyLayout(VStackLayout(alignment: .trailing, spacing: 0)) : AnyLayout(HStackLayout(alignment: .firstTextBaseline, spacing: 6))
        layout {
            Text(value).font(font).monospacedDigit()
            Text("illustrative").font(.caption2).foregroundStyle(.secondary)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(value), illustrative amount")
    }
}

/// Relative bar in the rebate colour. Square ends, like the handbook.
struct RebateBar: View {
    let share: Double
    var height: CGFloat = 10
    var color: Color = .nsRebate

    var body: some View {
        GeometryReader { geo in
            Rectangle().fill(color).frame(width: geo.size.width * share)
        }
        .frame(height: height)
        .accessibilityHidden(true)
    }
}

/// The fixed prototype notice at the bottom of every screen.
struct PrototypeNotice: View {
    var body: some View {
        Text("Prototype. All amounts and data are illustrative.")
            .font(.caption2)
            .foregroundStyle(.secondary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 6)
            .background(.bar)
    }
}

extension View {
    func prototypeNotice() -> some View {
        safeAreaInset(edge: .bottom, spacing: 0) { PrototypeNotice() }
    }
}

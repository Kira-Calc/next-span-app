import SwiftUI

enum Screen: Hashable, CaseIterable, Identifiable {
    case estimate, checklist, grade, listing, search, batch, accept, certificates
    var id: Self { self }

    var number: String {
        switch self {
        case .estimate: "1"
        case .checklist: "2"
        case .grade: "3"
        case .listing: "4"
        case .search: "5"
        case .batch: "6"
        case .accept: "7"
        case .certificates: "8"
        }
    }

    var title: String {
        switch self {
        case .estimate: "Rebate estimate"
        case .checklist: "Checklist"
        case .grade: "Grade on site"
        case .listing: "Batch and listing"
        case .search: "Stock search"
        case .batch: "Batch page"
        case .accept: "Accept on delivery"
        case .certificates: "Certificates"
        }
    }

    var side: Side {
        switch self {
        case .estimate, .checklist, .grade, .listing: .developer
        default: .specifier
        }
    }

    /// The journey this screen belongs to, used when jumping from the screen menu.
    var stack: [Screen] {
        switch self {
        case .estimate: [.estimate]
        case .checklist: [.estimate, .checklist]
        case .grade: [.estimate, .checklist, .grade]
        case .listing: [.estimate, .checklist, .grade, .listing]
        case .search: [.search]
        case .batch: [.search, .batch]
        case .accept: [.search, .batch, .accept]
        case .certificates: [.search, .batch, .accept, .certificates]
        }
    }
}

enum Mark: String { case ok, unknown, fail }

/// All prototype state lives in memory, so relaunching resets the demo.
@Observable
final class AppState {
    var path: [Screen] = []

    // Screen 1
    var built = "Before 1950"
    var area = "120"
    var timber = "Hardwood"
    var r1Open = false

    // Screen 2
    var lodged = false

    // Screen 3
    var member = 7
    var grade: Grade = .B
    var downgradeApplied = false
    var checks: [String: Mark] = [
        "Splits and checks": .ok, "Nail and bolt holes": .ok, "Decay": .ok, "Insect damage": .ok,
        "Paint or coatings": .unknown, "Straightness": .ok, "Wane": .ok,
    ]

    // Screen 4
    var listed = false
    var priceStep = 0

    // Screen 5
    var length: String?
    var section: String?
    var gradeFilter: Set<Grade> = [.A, .B]
    var shortlisted = false

    // Screen 6
    var scannedMember: String?

    // Screen 7
    var accepted = false
    var delivered: [Grade: Int] = DemoData.grades

    /// Where a demo or screenshot run should scroll to on appear.
    var scrollTarget: String?

    func jump(to screen: Screen) { path = screen.stack }

    /// Screenshot runs: NS_SCREEN picks the screen, NS_STATE sets up a state on it.
    func applyLaunchEnvironment() {
        let env = ProcessInfo.processInfo.environment
        guard let name = env["NS_SCREEN"], let screen = Screen.allCases.first(where: { "\($0)" == name }) else { return }
        jump(to: screen)
        scannedMember = env["NS_MEMBER"]
        switch env["NS_STATE"] {
        case "r1": r1Open = true; scrollTarget = "r1"
        case "lodged": lodged = true; scrollTarget = "lodge"
        case "downgrade": checks["Decay"] = .fail; scrollTarget = "downgrade"
        case "locked": listed = true; scrollTarget = "rebate"
        case "shortlisted": shortlisted = true
        case "accepted": accepted = true
        default: break
        }
    }
}

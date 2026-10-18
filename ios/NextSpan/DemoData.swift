import Foundation

// Word for word from app_spec.md section 5. No network; state resets on relaunch.
enum DemoData {
    static let batchID = "NS-0412"
    static let members = 24
    static let grades: [Grade: Int] = [.A: 6, .B: 10, .C: 5, .D: 3]
    static let sampleMembers: [String: Grade] = ["03": .A, "07": .B, "15": .C, "21": .D]
    static let section = "90 × 45"
    static let length = "2 400"
    static let graded = "12 Oct 2026"
    static let listed = "14 Oct 2026"
    static let updated = "16 Oct 2026"
    static let source = "Pre-1950 house, Brisbane (illustrative)"
    static let buyer = "Small practice architect, Brisbane"
    static let money = "$ XXX"
    static let carbon = "XXX kg CO2e"
    static let price = "$ XX / m"
    static let liveURL = URL(string: "https://kira-calc.github.io/next-span-app/")!

    static func count(_ g: Grade) -> Int { grades[g] ?? 0 }
    static let maxCount = 10

    struct Tier: Identifiable {
        let code: String
        let name: String
        let share: Double
        var highest = false
        var id: String { code }
    }

    // Relative lengths match Claim Handbook Part 1.
    static let tiers = [
        Tier(code: "R1", name: "Retain the structure", share: 1, highest: true),
        Tier(code: "R4", name: "Re-use whole components", share: 0.75),
        Tier(code: "R7/R8", name: "Remanufacture or re-purpose", share: 0.5),
        Tier(code: "R9", name: "Recycle", share: 0.25),
    ]

    static let built = ["Before 1950", "1950–1980", "After 1980"]
    static let timber = ["Hardwood", "Softwood", "Not sure"]
    static let r1Steps = ["Plan lodged", "Works complete", "Council confirms", "Rebate released"]
    static let journey = ["Estimate", "Checklist", "Grade", "List", "Accept"]

    static let checks = [
        "Splits and checks", "Nail and bolt holes", "Decay", "Insect damage",
        "Paint or coatings", "Straightness", "Wane",
    ]

    struct Known: Identifiable { let what, value, source: String; var id: String { what } }
    struct Unknown: Identifiable { let what, ask: String; var id: String { what } }

    static let known = [
        Known(what: "Section", value: "90 × 45", source: "Measured by grader, 12 Oct 2026"),
        Known(what: "Length", value: "2 400", source: "Measured by grader, 12 Oct 2026"),
        Known(what: "Defects", value: "Recorded", source: "Grader, 12 Oct 2026"),
    ]
    static let unknown = [
        Unknown(what: "Species", ask: "supplier"),
        Unknown(what: "Moisture", ask: "supplier to test"),
        Unknown(what: "Coatings", ask: "lab test before indoor use"),
        Unknown(what: "Structural use", ask: "certifier or engineer"),
    ]

    static let lengths = ["≥ 1 800", "2 400", "3 000"]
    static let lengthMin = ["≥ 1 800": 1800, "2 400": 2400, "3 000": 3000]
    static let sections = ["90 × 45", "140 × 45", "Any"]
}

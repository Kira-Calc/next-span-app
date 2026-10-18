import SwiftUI

struct SearchView: View {
    @Environment(AppState.self) private var state

    private var match: Bool {
        let lengthOK = state.length.map { 2400 >= (DemoData.lengthMin[$0] ?? 0) } ?? true
        let sectionOK = state.section.map { $0 == "Any" || $0 == DemoData.section } ?? true
        return lengthOK && sectionOK
    }
    private var shown: [Grade] { state.gradeFilter.isEmpty ? Grade.allCases : Grade.allCases.filter { state.gradeFilter.contains($0) } }
    private var pieces: Int { shown.reduce(0) { $0 + DemoData.count($1) } }

    var body: some View {
        @Bindable var state = state
        List {
            Section {
                FilterRow(title: "Length (mm)", options: DemoData.lengths, selection: $state.length)
                FilterRow(title: "Section (mm)", options: DemoData.sections, selection: $state.section)
                VStack(alignment: .leading, spacing: 8) {
                    Text("Grade").font(.subheadline.weight(.semibold))
                    HStack(spacing: 8) {
                        ForEach(Grade.allCases) { g in
                            let on = state.gradeFilter.contains(g)
                            Button {
                                if on { state.gradeFilter.remove(g) } else { state.gradeFilter.insert(g) }
                            } label: {
                                VStack(spacing: 6) {
                                    GradeBadge(grade: g, size: 40, decorative: true)
                                    Image(systemName: on ? "checkmark.circle.fill" : "circle")
                                        .foregroundStyle(on ? Color.nsGradeA : Color.secondary)
                                }
                                .frame(maxWidth: .infinity, minHeight: 76)
                                .background(Color(.tertiarySystemFill).opacity(on ? 1 : 0.5), in: .rect(cornerRadius: 12, style: .continuous))
                                .overlay {
                                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                                        .strokeBorder(on ? Color.nsGradeA : .clear, lineWidth: 2)
                                }
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel("Grade \(g.rawValue), \(g.name)")
                            .accessibilityAddTraits(on ? [.isSelected, .isButton] : .isButton)
                        }
                    }
                }
                .padding(.vertical, 4)
            } header: {
                NumberedHeader(number: "01", title: "What you need")
            }

            Section {
                if match {
                    ResultCard(pieces: pieces, grades: shown)
                } else {
                    ContentUnavailableView("Nothing at this size yet", systemImage: "magnifyingglass", description: Text("Try a shorter length or Any section."))
                }
                SampleCard()
            } header: {
                NumberedHeader(number: "02", title: match ? "1 batch matches" : "No batches match")
            }
        }
        .navigationTitle("Stock search")
        .navigationSubtitle("Specifier")
        .safeAreaInset(edge: .top, spacing: 0) {
            if state.shortlisted {
                HStack {
                    Label("Project shortlist (1)", systemImage: "list.star")
                        .font(.subheadline.weight(.semibold))
                    Spacer()
                    Text(DemoData.batchID).font(.subheadline.monospacedDigit()).foregroundStyle(.secondary)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .glassEffect(.regular.tint(Color.nsGradeA.opacity(0.15)), in: .capsule)
                .padding(.horizontal, 16)
                .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
    }
}

private struct FilterRow: View {
    let title: String
    let options: [String]
    @Binding var selection: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.subheadline.weight(.semibold))
            Picker(title, selection: $selection) {
                Text("All").tag(String?.none)
                ForEach(options, id: \.self) { Text($0).tag(String?.some($0)) }
            }
            .pickerStyle(.segmented)
            .labelsHidden()
        }
        .padding(.vertical, 4)
    }
}

private struct ResultCard: View {
    @Environment(AppState.self) private var state
    let pieces: Int
    let grades: [Grade]

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("\(DemoData.section) · \(DemoData.length)")
                .displayNumber(32)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            Text("\(pieces) pieces").font(.title3.weight(.semibold))
            HStack(spacing: 6) {
                ForEach(grades) { GradeBadge(grade: $0, size: 28) }
                Text(DemoData.batchID).font(.headline.monospacedDigit()).padding(.leading, 4)
            }
            Text("Updated \(DemoData.updated)").font(.subheadline.weight(.medium))
            Text(DemoData.source).font(.footnote).foregroundStyle(.secondary)
            HStack(spacing: 10) {
                Button {
                    withAnimation { state.shortlisted.toggle() }
                } label: {
                    Label(state.shortlisted ? "Shortlisted" : "Shortlist", systemImage: state.shortlisted ? "checkmark" : "plus")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.glass)
                .accessibilityHint("Adds this batch to your project shortlist")
                Button {
                    state.scannedMember = nil
                    state.path = [.search, .batch]
                } label: {
                    Text("Open batch").frame(maxWidth: .infinity)
                }
                .buttonStyle(.glassProminent)
            }
            .controlSize(.large)
            .padding(.top, 4)
        }
        .padding(.vertical, 6)
    }
}

private struct SampleCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("SAMPLE").font(.caption.weight(.bold)).tracking(0.6)
                .padding(.horizontal, 6).padding(.vertical, 2)
                .overlay(Rectangle().stroke(Color.secondary, lineWidth: 1))
            Text("140 × 45 · 3 000").displayNumber(26)
            Text("NS-0398").font(.headline.monospacedDigit())
            Text("Sample listing. Not available in this prototype.").font(.footnote)
        }
        .foregroundStyle(.secondary)
        .padding(.vertical, 6)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Sample listing NS-0398, not available")
    }
}

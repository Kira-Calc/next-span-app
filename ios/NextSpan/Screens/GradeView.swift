import SwiftUI

struct GradeView: View {
    @Environment(AppState.self) private var state
    @State private var printing = false

    private var anyFail: Bool { DemoData.checks.contains { state.checks[$0] == .fail } }
    private var checked: [String] { DemoData.checks.filter { state.checks[$0] == .ok } }
    private var unknown: [String] { DemoData.checks.filter { state.checks[$0] == nil || state.checks[$0] == .unknown } }

    var body: some View {
        ScrollViewReader { proxy in
            List {
                Section {
                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                        Text("Member").font(.title3.weight(.semibold))
                        Text(String(format: "%02d", state.member)).displayNumber(56)
                        Text("of \(DemoData.members)").font(.title3.weight(.semibold))
                    }
                    .accessibilityElement(children: .combine)
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets(top: 0, leading: 20, bottom: 0, trailing: 20))
                }

                Section {
                    LazyVGrid(columns: [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)], spacing: 10) {
                        ForEach(Grade.allCases) { g in
                            GradeChoice(grade: g, selected: state.grade == g) {
                                state.grade = g
                                state.downgradeApplied = false
                            }
                        }
                    }
                    .padding(.vertical, 6)
                    if state.grade == .A {
                        Label("Structural use requires certifier sign-off.", systemImage: "checkmark.seal")
                            .font(.callout.weight(.semibold))
                            .foregroundStyle(Color.nsGradeA)
                    }
                } header: {
                    NumberedHeader(number: "01", title: "Grade this piece")
                }

                Section {
                    ForEach(DemoData.checks, id: \.self) { item in
                        CheckRow(item: item, mark: state.checks[item]) { m in
                            state.checks[item] = state.checks[item] == m ? nil : m
                        }
                    }
                } header: {
                    NumberedHeader(number: "02", title: "Checks")
                }

                if anyFail {
                    Section {
                        VStack(alignment: .leading, spacing: 12) {
                            Label("One check moves this piece down a grade.", systemImage: "arrow.down.square.fill")
                                .font(.callout.weight(.semibold))
                                .foregroundStyle(Color.nsRejected)
                            if !state.downgradeApplied && state.grade != .D {
                                HStack(spacing: 12) {
                                    GradeBadge(grade: state.grade.next, size: 44)
                                    VStack(alignment: .leading) {
                                        Text("Suggested").font(.caption).foregroundStyle(.secondary)
                                        Text("Grade \(state.grade.next.rawValue)").font(.headline)
                                    }
                                    Spacer()
                                    Button("Use \(state.grade.next.rawValue)") {
                                        state.grade = state.grade.next
                                        state.downgradeApplied = true
                                    }
                                    .buttonStyle(.glass)
                                }
                            }
                        }
                        .padding(.vertical, 4)
                    }
                    .id("downgrade")
                }

                Section {
                    HStack(alignment: .top) {
                        RecordColumn(title: "Checked", items: checked)
                        RecordColumn(title: "Unknown", items: unknown)
                    }
                } header: {
                    NumberedHeader(number: "03", title: "Record for this piece")
                }
                .id("record")

                Section {
                    Button {
                        state.jump(to: .listing)
                    } label: {
                        Text("Finish grading").frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.glassProminent)
                    .controlSize(.large)
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets())
                }
            }
            .navigationTitle("Grade on site")
            .navigationSubtitle("Batch \(DemoData.batchID)")
            .toolbar {
                ToolbarItemGroup(placement: .bottomBar) {
                    Button("Print label", systemImage: "printer") { printing = true }
                    Spacer()
                    Button {
                        state.member += 1
                        state.checks = [:]
                        state.downgradeApplied = false
                    } label: {
                        Label("Next member", systemImage: "arrow.right")
                            .labelStyle(.titleAndIcon)
                    }
                    .disabled(state.member >= DemoData.members)
                }
            }
            .sheet(isPresented: $printing) {
                LabelPreview()
                    .presentationDetents([.medium])
            }
            .onAppear {
                if let t = state.scrollTarget, t == "downgrade" || t == "record" {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { proxy.scrollTo(t, anchor: .center) }
                }
            }
        }
    }
}

private struct GradeChoice: View {
    let grade: Grade
    let selected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 8) {
                HStack(alignment: .top) {
                    GradeBadge(grade: grade, size: 64, decorative: true)
                    Spacer()
                    Image(systemName: selected ? "checkmark.circle.fill" : "circle")
                        .font(.title2)
                        .foregroundStyle(selected ? Color.nsInk : Color.secondary)
                }
                Text("Grade \(grade.rawValue)").font(.headline)
                Text(grade.name).font(.footnote).foregroundStyle(.secondary)
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(.secondarySystemGroupedBackground), in: .rect(cornerRadius: 16, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .strokeBorder(selected ? Color.nsInk : Color(.separator), lineWidth: selected ? 2 : 1)
            }
            .contentShape(.rect(cornerRadius: 16))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Grade \(grade.rawValue), \(grade.name)")
        .accessibilityAddTraits(selected ? [.isSelected, .isButton] : .isButton)
    }
}

private struct CheckRow: View {
    let item: String
    let mark: Mark?
    let set: (Mark) -> Void

    private let options: [(Mark, String, String)] = [
        (.ok, "checkmark", "checked"),
        (.unknown, "questionmark", "unknown"),
        (.fail, "xmark", "fails"),
    ]

    var body: some View {
        HStack {
            Text(item).font(.body)
            Spacer()
            HStack(spacing: 6) {
                ForEach(options, id: \.0) { m, symbol, name in
                    let on = mark == m
                    Button { set(m) } label: {
                        Image(systemName: symbol)
                            .font(.body.weight(.bold))
                            .frame(width: 44, height: 44)
                            .foregroundStyle(on ? Color.white : Color.primary)
                            .background(
                                on ? (m == .fail ? Color.nsRejected : Color.nsInkFixed) : Color(.tertiarySystemFill),
                                in: .rect(cornerRadius: 10, style: .continuous)
                            )
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("\(item): \(name)")
                    .accessibilityAddTraits(on ? .isSelected : [])
                }
            }
        }
    }
}

private struct RecordColumn: View {
    let title: String
    let items: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title.uppercased()).font(.caption.weight(.bold)).tracking(0.6)
            if items.isEmpty {
                Text("None").foregroundStyle(.secondary)
            } else {
                ForEach(items, id: \.self) { Text($0).font(.subheadline) }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }
}

struct LabelPreview: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Image("LabelB07")
                    .resizable()
                    .scaledToFit()
                    .overlay(Rectangle().stroke(Color(.separator), lineWidth: 1))
                    .accessibilityLabel("Grade B label, NS-0412, member 07 of 24")
                Text("150 × 100 mm label, printed on site.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                Spacer()
            }
            .padding()
            .navigationTitle("Label preview")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done", systemImage: "checkmark") { dismiss() }
                }
            }
        }
    }
}

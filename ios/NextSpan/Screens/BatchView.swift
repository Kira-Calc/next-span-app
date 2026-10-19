import SwiftUI

struct BatchView: View {
    @Environment(AppState.self) private var state
    @State private var downloadNote = false

    private var scanned: (member: String, grade: Grade)? {
        guard let m = state.scannedMember, let g = DemoData.sampleMembers[m] else { return nil }
        return (m, g)
    }

    var body: some View {
        ScrollViewReader { proxy in
        List {
            if let s = scanned {
                Section {
                    HStack(spacing: 12) {
                        GradeBadge(grade: s.grade, size: 48)
                        Text("You scanned member \(s.member) of \(DemoData.members), Grade \(s.grade.rawValue)")
                            .font(.headline)
                    }
                    .padding(.vertical, 4)
                }
                .listRowBackground(s.grade.color.opacity(0.12))
            }

            Section {
                VStack(alignment: .leading, spacing: 10) {
                    Text(DemoData.batchID).displayNumber(52)
                    HStack(alignment: .firstTextBaseline) {
                        Text("\(DemoData.section) · \(DemoData.length)").font(.title3.weight(.bold).monospacedDigit())
                        Text("mm").font(.footnote).foregroundStyle(.secondary)
                        Spacer()
                        Text("\(DemoData.members)").font(.title3.weight(.bold).monospacedDigit())
                        Text("members").font(.footnote).foregroundStyle(.secondary)
                    }
                    DistributionStrip(highlight: scanned?.grade)
                }
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets(top: 0, leading: 20, bottom: 0, trailing: 20))
            }

            Section {
                ForEach(DemoData.known) { k in
                    VStack(alignment: .leading, spacing: 2) {
                        LabeledContent(k.what) { Text(k.value).font(.body.weight(.semibold)).foregroundStyle(.primary) }
                        Text(k.source).font(.caption).foregroundStyle(.secondary)
                    }
                }
            } header: {
                NumberedHeader(number: "01", title: "What we know")
            }

            Section {
                ForEach(DemoData.unknown) { u in
                    HStack(alignment: .firstTextBaseline, spacing: 12) {
                        Text(u.what)
                        Spacer(minLength: 8)
                        Text("Ask: \(u.ask)")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(Color.nsGradeA)
                            .multilineTextAlignment(.trailing)
                    }
                    .accessibilityElement(children: .combine)
                }
            } header: {
                NumberedHeader(number: "02", title: "What we don't")
            }

            Section {
                LabeledContent("Timber") { Money(font: .body.weight(.semibold)).foregroundStyle(Color.nsInk) }
                LabeledContent("De-nailing", value: "Included")
                LabeledContent("Machining") { StatusTag(text: "To quote", kind: .quote) }
                LabeledContent("Delivery") { StatusTag(text: "To quote", kind: .quote) }
                LabeledContent("Waste allowance", value: "10% assumed")
                LabeledContent {
                    Money(font: .title2.weight(.bold)).foregroundStyle(Color.nsInk)
                } label: {
                    Text("Known total").font(.headline)
                }
            } header: {
                NumberedHeader(number: "03", title: "Price breakdown")
            } footer: {
                Text("Items marked to quote are not included.").font(.footnote.weight(.semibold))
            }
            .id("price")

            Section {
                VStack(alignment: .leading, spacing: 6) {
                    Text(DemoData.source).font(.headline)
                    Text("Graded \(DemoData.graded) · Listed \(DemoData.listed)").font(.subheadline).foregroundStyle(.secondary)
                    HStack(alignment: .firstTextBaseline, spacing: 6) {
                        Text(DemoData.carbon).font(.title3.weight(.bold))
                        Text("kept in use").font(.subheadline)
                        Text("illustrative").font(.caption2).foregroundStyle(.secondary)
                    }
                    .padding(.top, 4)
                }
                .padding(.vertical, 4)
            } header: {
                NumberedHeader(number: "04", title: "Source")
            }

            Section {
                Button {
                    state.jump(to: .accept)
                } label: {
                    Text("Specify this batch").frame(maxWidth: .infinity)
                }
                .buttonStyle(.glassProminent)
                .controlSize(.large)
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets())
            }
        }
        .navigationTitle("Batch page")
        .navigationSubtitle("Specifier")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Download record", systemImage: "arrow.down.doc") { downloadNote = true }
            }
        }
        .alert("Prototype: download not available", isPresented: $downloadNote) {
            Button("OK", role: .cancel) {}
        }
        .onAppear {
            if state.scrollTarget == "price" {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { proxy.scrollTo("price", anchor: .top) }
            }
        }
        }
    }
}

/// Read-only distribution of members by grade. Square segments, brand element.
struct DistributionStrip: View {
    var highlight: Grade?

    var body: some View {
        GeometryReader { geo in
            let total = CGFloat(DemoData.members)
            let gap: CGFloat = 3
            let usable = geo.size.width - gap * 3
            HStack(alignment: .top, spacing: gap) {
                ForEach(Grade.allCases) { g in
                    VStack(alignment: .leading, spacing: 6) {
                        Rectangle()
                            .fill(g.color)
                            .frame(height: highlight == g ? 26 : 18)
                            .overlay(Rectangle().stroke(highlight == g ? Color.nsInk : .clear, lineWidth: 2))
                            .frame(height: 26, alignment: .bottom)
                        HStack(spacing: 4) {
                            GradeBadge(grade: g, size: 18, decorative: true)
                            Text("\(DemoData.count(g))").font(.caption.weight(.bold).monospacedDigit())
                        }
                    }
                    .frame(width: usable * CGFloat(DemoData.count(g)) / total)
                }
            }
        }
        .frame(height: 54)
        .accessibilityElement()
        .accessibilityLabel("Members by grade: A 6, B 10, C 5, D 3")
    }
}

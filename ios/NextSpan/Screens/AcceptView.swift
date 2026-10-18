import SwiftUI

struct AcceptView: View {
    @Environment(AppState.self) private var state
    @State private var sheet: SheetKind?

    enum SheetKind: String, Identifiable { case scan, reject; var id: String { rawValue } }

    var body: some View {
        Group {
            if state.accepted { AcceptedView() } else { before }
        }
        .navigationTitle(state.accepted ? "Accepted" : "Delivery for \(DemoData.batchID)")
        .navigationSubtitle("Specifier")
        .fullScreenCover(item: $sheet) { kind in
            switch kind {
            case .scan:
                ImageViewer(image: "LabelB07", title: "Scanned: member 07 of 24", band: .nsGradeA)
            case .reject:
                ImageViewer(image: "RejectionNotice", title: "Grade mismatch reported", band: .nsRejected, footerTitle: "Back to delivery")
            }
        }
    }

    private var before: some View {
        @Bindable var state = state
        return List {
            Section {
                ForEach(Grade.allCases) { g in
                    Stepper(value: Binding(get: { state.delivered[g] ?? 0 }, set: { state.delivered[g] = $0 }), in: 0...99) {
                        HStack(spacing: 12) {
                            GradeBadge(grade: g, size: 44)
                            VStack(alignment: .leading, spacing: 0) {
                                Text("Listed \(DemoData.count(g))").font(.subheadline).foregroundStyle(.secondary)
                                Text("Delivered \(state.delivered[g] ?? 0)").font(.headline.monospacedDigit())
                            }
                        }
                    }
                    .accessibilityLabel("Grade \(g.rawValue), listed \(DemoData.count(g)), delivered \(state.delivered[g] ?? 0)")
                }
                Button("Scan a label", systemImage: "qrcode.viewfinder") { sheet = .scan }
            } header: {
                NumberedHeader(number: "01", title: "Count what arrived")
            }

            Section {
                Button {
                    withAnimation(.easeOut(duration: 0.3)) { state.accepted = true }
                } label: {
                    Text("Accept batch").frame(maxWidth: .infinity)
                }
                .buttonStyle(.glassProminent)
                .controlSize(.large)
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets())

                Button(role: .destructive) {
                    sheet = .reject
                } label: {
                    Text("Report a grade mismatch").frame(maxWidth: .infinity)
                        .foregroundStyle(Color.nsRejected)
                }
                .buttonStyle(.glass)
                .tint(.nsRejected)
                .controlSize(.large)
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets(top: 10, leading: 0, bottom: 0, trailing: 0))
            } footer: {
                Text("Generic framework. Not an official Brisbane City Council document.")
                    .padding(.top, 8)
            }
        }
    }
}

/// Both sides of the deal on one screen: the buyer's acceptance on top, the developer's payment below.
private struct AcceptedView: View {
    @Environment(AppState.self) private var state
    @State private var filled = false

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 10) {
                    Text("YOU").font(.footnote.weight(.bold)).tracking(0.6).opacity(0.85)
                    Text("Batch accepted").font(.largeTitle.weight(.bold))
                    Label("Carbon certificate issued", systemImage: "checkmark.seal.fill")
                        .font(.title3.weight(.semibold))
                }
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(20)
                .background(Color.nsGradeA, in: .rect(cornerRadius: 24, style: .continuous))
                .transition(.move(edge: .top).combined(with: .opacity))

                HStack(spacing: 10) {
                    Rectangle().fill(Color.nsInk).frame(height: 2)
                    Text("Payment and use meet here.").font(.subheadline.weight(.bold)).fixedSize()
                    Rectangle().fill(Color.nsInk).frame(height: 2)
                }
                .padding(.vertical, 18)

                // Developer half mirrors the buyer card above. The rebate colour sweeps
                // across the whole card at the moment of acceptance (300 ms).
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Text("DEVELOPER").font(.footnote.weight(.bold)).tracking(0.6).opacity(0.85)
                        Spacer()
                        Text(filled ? "RELEASED" : "LOCKED")
                            .font(.caption.weight(.bold)).tracking(0.6)
                            .foregroundStyle(Color.nsInkFixed)
                            .padding(.horizontal, 8).padding(.vertical, 4)
                            .background(.white)
                            .contentTransition(.opacity)
                            .accessibilityLabel("Status: \(filled ? "Released" : "Locked")")
                    }
                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                        Text(DemoData.money).font(.system(size: 44, weight: .bold))
                        Text("illustrative").font(.caption2.weight(.semibold))
                            .foregroundStyle(Color.nsInkFixed)
                            .padding(.horizontal, 5).padding(.vertical, 2)
                            .background(.white)
                    }
                    Label("Paid to developer", systemImage: "arrow.down.circle.fill")
                        .font(.title3.weight(.semibold))
                }
                .foregroundStyle(filled ? Color.white : Color.nsInk)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(20)
                .background {
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            Color(.secondarySystemGroupedBackground)
                            Color.nsRebate.frame(width: filled ? geo.size.width : 0)
                        }
                    }
                    .clipShape(.rect(cornerRadius: 24, style: .continuous))
                }
                .overlay(RoundedRectangle(cornerRadius: 24, style: .continuous).strokeBorder(Color.nsRebate, lineWidth: filled ? 0 : 1))
                .accessibilityElement(children: .combine)

                Text("The council receives the acceptance record that closes the claim.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, 16)
                Text("Generic framework. Not an official Brisbane City Council document.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, 4)

                Button {
                    state.jump(to: .certificates)
                } label: {
                    Text("View certificates").frame(maxWidth: .infinity)
                }
                .buttonStyle(.glassProminent)
                .tint(.nsInk)
                .controlSize(.large)
                .padding(.top, 20)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
        .background(Color(.systemGroupedBackground))
        .accessibilityElement(children: .contain)
        .onAppear {
            withAnimation(.easeOut(duration: 0.3).delay(0.1)) { filled = true }
        }
    }
}

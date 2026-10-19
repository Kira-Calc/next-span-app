import SwiftUI

struct ListingView: View {
    @Environment(AppState.self) private var state
    @State private var notAvailable = false

    private var priceNote: String {
        let n = abs(state.priceStep)
        if n == 0 { return "Suggested" }
        return "\(n) step\(n > 1 ? "s" : "") \(state.priceStep > 0 ? "above" : "below") suggested"
    }

    var body: some View {
        @Bindable var state = state
        ScrollViewReader { proxy in
            List {
                Section {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(DemoData.batchID).displayNumber(52)
                        Text("\(DemoData.members) members").font(.title3.weight(.semibold))
                    }
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets(top: 0, leading: 20, bottom: 0, trailing: 20))
                }

                Section {
                    ForEach(Grade.allCases) { g in
                        HStack(spacing: 12) {
                            GradeBadge(grade: g, size: 36)
                            Text("\(DemoData.count(g))")
                                .font(.title2.weight(.bold).monospacedDigit())
                                .frame(width: 36, alignment: .trailing)
                            RebateBar(share: Double(DemoData.count(g)) / Double(DemoData.maxCount), height: 18, color: g.color)
                        }
                        .accessibilityElement(children: .ignore)
                        .accessibilityLabel("Grade \(g.rawValue), \(DemoData.count(g)) members")
                    }
                } header: {
                    NumberedHeader(number: "01", title: "Members by grade")
                }

                Section {
                    Stepper {
                        VStack(alignment: .leading, spacing: 2) {
                            Money(value: DemoData.price, font: .title3.weight(.bold))
                            Text(priceNote).font(.footnote.weight(.semibold)).foregroundStyle(.secondary)
                        }
                    } onIncrement: {
                        state.priceStep += 1
                    } onDecrement: {
                        state.priceStep -= 1
                    }
                    .disabled(state.listed)
                } header: {
                    NumberedHeader(number: "02", title: "Price")
                }

                Section {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(spacing: 6) {
                            StatusTag(text: state.listed ? "Locked" : "Calculated", kind: state.listed ? .rebate : .neutral)
                            if state.listed {
                                // v2: says plainly that LOCKED is not money in hand.
                                Text("NOT PAID YET")
                                    .font(.caption.weight(.bold)).tracking(0.6)
                                    .foregroundStyle(Color.nsInk)
                                    .padding(.horizontal, 8).padding(.vertical, 3)
                                    .background(.white)
                                    .overlay(Rectangle().strokeBorder(Color.nsInk, lineWidth: 2))
                            }
                        }
                        .fixedSize(horizontal: false, vertical: true)
                        Money(font: .system(size: 44, weight: .bold))
                        ZStack(alignment: .leading) {
                            Rectangle().stroke(Color.nsRebate, lineWidth: 1)
                            Rectangle().fill(Color.nsRebate)
                                .frame(maxWidth: state.listed ? .infinity : 0)
                        }
                        .frame(height: 44)
                        .accessibilityHidden(true)
                        if state.listed {
                            VStack(alignment: .leading, spacing: 10) {
                                RuleLine(n: 1, text: "Released only after a buyer accepts the batch.")
                                RuleLine(n: 2, text: "No expiry while the batch stays listed.")
                                RuleLine(n: 3, text: "If it does not sell, relist it or move pieces down a grade.")
                            }
                            .padding(.top, 4)
                            HStack(spacing: 10) {
                                Button { notAvailable = true } label: {
                                    Text("Relist").frame(maxWidth: .infinity, minHeight: 40)
                                }
                                Button { notAvailable = true } label: {
                                    Text("Move pieces down a grade")
                                        .multilineTextAlignment(.center)
                                        .frame(maxWidth: .infinity, minHeight: 40)
                                }
                            }
                            .buttonStyle(.glass)
                            .controlSize(.large)
                            .padding(.top, 4)
                        }
                    }
                    .padding(.vertical, 6)
                    .id("rebate")

                    if !state.listed {
                        Button {
                            withAnimation(.easeOut(duration: 0.2)) { state.listed = true }
                        } label: {
                            Text("List batch").frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.glassProminent)
                        .controlSize(.large)
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets(top: 12, leading: 0, bottom: 0, trailing: 0))
                    }
                } header: {
                    NumberedHeader(number: "03", title: "Rebate")
                }

                if state.listed {
                    Section {
                        HStack(spacing: 10) {
                            DemandTile(number: "3", text: "Shortlisted by 3 projects")
                            DemandTile(number: "18", text: "Viewed 18 times")
                        }
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets())
                    } header: {
                        NumberedHeader(number: "04", title: "After listing")
                    } footer: {
                        Text("Demand figures are illustrative.")
                    }

                    Section {
                        Button {
                            state.scannedMember = nil
                            state.path = [.search, .batch]
                        } label: {
                            Text("View as a buyer").frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.glassProminent)
                        .tint(.nsGradeA)
                        .controlSize(.large)
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets())
                    }
                }
            }
            .alert("Prototype: not available", isPresented: $notAvailable) {
                Button("OK", role: .cancel) {}
            }
            .navigationTitle("Batch and listing")
            .navigationSubtitle("Developer")
            .onAppear {
                if state.scrollTarget == "rebate" {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { proxy.scrollTo("rebate", anchor: .top) }
                }
            }
        }
    }
}

private struct DemandTile: View {
    let number: String
    let text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(number).displayNumber(40)
            Text(text).font(.subheadline.weight(.semibold))
        }
        .foregroundStyle(.white)
        .padding(16)
        .frame(maxWidth: .infinity, minHeight: 120, alignment: .topLeading)
        .background(Color.nsInkFixed, in: .rect(cornerRadius: 20, style: .continuous))
        .accessibilityElement(children: .combine)
    }
}

/// One numbered rule under the locked rebate. The number sits in a small square (brand element).
private struct RuleLine: View {
    let n: Int
    let text: String

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 10) {
            Text("\(n)")
                .font(.caption.weight(.bold).monospacedDigit())
                .foregroundStyle(.white)
                .frame(width: 20, height: 20)
                .background(Color.nsInkFixed)
                .alignmentGuide(.firstTextBaseline) { $0[VerticalAlignment.center] + 5 }
            Text(text).font(.callout.weight(.semibold))
                .fixedSize(horizontal: false, vertical: true)
        }
        .accessibilityElement(children: .combine)
    }
}

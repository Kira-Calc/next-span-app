import SwiftUI

struct ListingView: View {
    @Environment(AppState.self) private var state

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
                        StatusTag(text: state.listed ? "Locked" : "Calculated", kind: state.listed ? .rebate : .neutral)
                        Money(font: .system(size: 44, weight: .bold))
                        ZStack(alignment: .leading) {
                            Rectangle().stroke(Color.nsRebate, lineWidth: 1)
                            Rectangle().fill(Color.nsRebate)
                                .frame(maxWidth: state.listed ? .infinity : 0)
                        }
                        .frame(height: 44)
                        .accessibilityHidden(true)
                        if state.listed {
                            Text("Locked at listing. Released when a buyer accepts.")
                                .font(.callout.weight(.semibold))
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
                        Label("If no buyer accepts, the rebate stays locked. You can relist or move pieces down a grade.", systemImage: "lock")
                            .font(.callout)
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

import SwiftUI

struct EstimateView: View {
    @Environment(AppState.self) private var state

    var body: some View {
        @Bindable var state = state
        ScrollViewReader { proxy in
            Form {
                Section {
                    Text("Before you sign a demolition quote")
                        .font(.title2.weight(.bold))
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets(top: 0, leading: 20, bottom: 0, trailing: 20))
                }

                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("House built").font(.subheadline.weight(.semibold))
                        Picker("House built", selection: $state.built) {
                            ForEach(DemoData.built, id: \.self) { Text($0) }
                        }
                        .pickerStyle(.segmented)
                        .labelsHidden()
                    }
                    .padding(.vertical, 4)
                    LabeledContent("Floor area") {
                        HStack(spacing: 4) {
                            TextField("Floor area", text: $state.area)
                                .keyboardType(.numberPad)
                                .multilineTextAlignment(.trailing)
                                .monospacedDigit()
                                .frame(maxWidth: 80)
                            Text("m²").foregroundStyle(.secondary)
                        }
                    }
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Main timber").font(.subheadline.weight(.semibold))
                        Picker("Main timber", selection: $state.timber) {
                            ForEach(DemoData.timber, id: \.self) { Text($0) }
                        }
                        .pickerStyle(.segmented)
                        .labelsHidden()
                    }
                    .padding(.vertical, 4)
                } header: {
                    NumberedHeader(number: "01", title: "Your house")
                }

                Section {
                    ForEach(DemoData.tiers) { TierRow(tier: $0) }
                } header: {
                    NumberedHeader(number: "02", title: "Estimated rebate")
                } footer: {
                    Text("Bar lengths are relative.")
                }

                Section {
                    VStack(alignment: .leading, spacing: 6) {
                        Label("Condition", systemImage: "ruler")
                            .font(.footnote.weight(.bold))
                            .foregroundStyle(.secondary)
                        Text("Your new build qualifies only if it uses the standard dimension catalogue (R3 Redesign).")
                            .font(.callout.weight(.semibold))
                    }
                    .padding(.vertical, 4)
                }

                Section {
                    Button {
                        state.jump(to: .checklist)
                    } label: {
                        Text("Plan deconstruction").frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.glassProminent)
                    .controlSize(.large)
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets())

                    Button {
                        withAnimation(.easeOut(duration: 0.25)) { state.r1Open.toggle() }
                        if state.r1Open { withAnimation { proxy.scrollTo("r1", anchor: .bottom) } }
                    } label: {
                        Label("Keep the structure (R1)", systemImage: state.r1Open ? "chevron.up" : "chevron.down")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.glass)
                    .controlSize(.large)
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 0, trailing: 0))
                    .accessibilityHint(state.r1Open ? "Hides the retention details" : "Shows how the retention rebate is paid")
                }

                if state.r1Open {
                    Section {
                        VStack(alignment: .leading, spacing: 14) {
                            Rectangle().fill(Color.nsRebate).frame(height: 6).padding(.horizontal, -20).padding(.top, -12)
                            HStack {
                                Text("Retention").font(.headline)
                                Spacer()
                                StatusTag(text: "Pending confirmation", kind: .rebate)
                            }
                            Text("Retention skips grading, listing and acceptance. The retention rebate is paid once the council confirms the structure was kept.")
                                .font(.callout)
                            StepBar(steps: DemoData.r1Steps, current: 0)
                        }
                        .padding(.vertical, 4)
                        .id("r1")
                    }
                }

                Section {
                } footer: {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Estimate only. Rates are set each year.")
                        Text("Generic framework. Not an official Brisbane City Council document.")
                    }
                }
            }
            .navigationTitle("Rebate estimate")
            .navigationSubtitle("Developer")
            .onAppear {
                if let t = state.scrollTarget {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { proxy.scrollTo(t, anchor: .bottom) }
                }
            }
        }
    }
}

private struct TierRow: View {
    let tier: DemoData.Tier

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            if tier.highest {
                StatusTag(text: "Highest")
            }
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(tier.code)
                        .font(tier.highest ? .largeTitle.weight(.bold) : .title2.weight(.bold))
                    Text(tier.name).font(.subheadline.weight(.medium))
                }
                Spacer()
                Money(font: tier.highest ? .title.weight(.bold) : .title3.weight(.bold), stacked: true)
            }
            RebateBar(share: tier.share, height: tier.highest ? 14 : 10)
        }
        .padding(.vertical, 6)
        .accessibilityElement(children: .combine)
    }
}

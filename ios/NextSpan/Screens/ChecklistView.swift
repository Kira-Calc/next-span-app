import SwiftUI

struct ChecklistView: View {
    @Environment(AppState.self) private var state
    @State private var zoom = false

    var body: some View {
        ScrollViewReader { proxy in
            List {
                Section {
                    StepBar(steps: DemoData.journey, current: 1)
                        .padding(.vertical, 6)
                }

                Section {
                    Button { zoom = true } label: {
                        Image("ChecklistPage1")
                            .resizable()
                            .scaledToFit()
                            .overlay(alignment: .bottomTrailing) {
                                Label("Enlarge", systemImage: "arrow.up.left.and.arrow.down.right")
                                    .font(.footnote.weight(.semibold))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                    .glassEffect()
                                    .padding(10)
                            }
                    }
                    .buttonStyle(.plain)
                    .listRowInsets(EdgeInsets(top: 12, leading: 12, bottom: 12, trailing: 12))
                    .accessibilityLabel("Deconstruction checklist, page 1 of 2. Enlarge")
                } header: {
                    NumberedHeader(number: "01", title: "Deconstruction checklist")
                }

                Section {
                    LabeledContent("House built", value: state.built)
                    LabeledContent("Floor area", value: "\(state.area.isEmpty ? "Not given" : state.area) m²")
                    LabeledContent("Main timber", value: state.timber)
                    LabeledContent("Method", value: "Full deconstruction")
                    LabeledContent("Estimated rebate") { Money(font: .headline) }
                } header: {
                    NumberedHeader(number: "02", title: "Carried over from your estimate")
                }

                Section {
                    if state.lodged {
                        VStack(alignment: .leading, spacing: 10) {
                            StatusTag(text: "Ready to lodge", kind: .ready)
                            Text("The council receives the same record again when a buyer accepts the batch.")
                                .font(.callout.weight(.semibold))
                        }
                        .padding(.vertical, 6)
                        .transition(.opacity)
                    } else {
                        Button {
                            withAnimation(.easeOut(duration: 0.25)) { state.lodged = true }
                        } label: {
                            Label("Attach to demolition application", systemImage: "paperclip")
                        }
                    }
                } header: {
                    NumberedHeader(number: "03", title: "Lodge with the council")
                } footer: {
                    Text("Generic framework. Not an official Brisbane City Council form.")
                }
                .id("lodge")

                Section {
                    Button {
                        state.jump(to: .grade)
                    } label: {
                        Text("Start grading").frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.glassProminent)
                    .controlSize(.large)
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets())
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Checklist")
            .navigationSubtitle("Developer")
            .fullScreenCover(isPresented: $zoom) {
                ImageViewer(image: "ChecklistPage1", title: "Checklist, page 1 of 2")
            }
            .onAppear {
                if let t = state.scrollTarget, t == "lodge" {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { proxy.scrollTo(t, anchor: .center) }
                }
            }
        }
    }
}

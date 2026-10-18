import SwiftUI

struct WelcomeView: View {
    @Environment(AppState.self) private var state

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                VStack(alignment: .leading, spacing: 16) {
                    Image("Logo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 72, height: 72)
                        .accessibilityLabel("Next Span")
                    Text("Timber that is used again, paid for when it is.")
                        .font(.title.weight(.bold))
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(.top, 24)

                VStack(spacing: 12) {
                    RoleCard(
                        side: "Developer",
                        title: "I'm removing a house",
                        symbol: "house.and.flag",
                        color: .nsInkFixed
                    ) { state.jump(to: .estimate) }
                    RoleCard(
                        side: "Specifier",
                        title: "I'm specifying timber",
                        symbol: "ruler",
                        color: .nsGradeA
                    ) { state.jump(to: .search) }
                }

                Button {
                    state.scannedMember = nil
                    state.jump(to: .batch)
                } label: {
                    Label("Open batch NS-0412", systemImage: "qrcode")
                        .font(.body.weight(.semibold))
                }
                .buttonStyle(.glass)
                .controlSize(.large)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 24)
        }
        .background(Color(.systemBackground))
        .toolbar(.hidden, for: .navigationBar)
        .prototypeNotice()
    }
}

private struct RoleCard: View {
    let side: String
    let title: String
    let symbol: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Image(systemName: symbol).font(.title2)
                    Spacer()
                    Image(systemName: "arrow.right").font(.title3.weight(.semibold))
                }
                Spacer(minLength: 28)
                Text(side.uppercased())
                    .font(.footnote.weight(.bold))
                    .tracking(0.6)
                    .opacity(0.85)
                Text(title)
                    .font(.title.weight(.bold))
                    .multilineTextAlignment(.leading)
            }
            .foregroundStyle(.white)
            .padding(22)
            .frame(maxWidth: .infinity, minHeight: 210, alignment: .leading)
            .background(color, in: .rect(cornerRadius: 28, style: .continuous))
            .contentShape(.rect(cornerRadius: 28, style: .continuous))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(title). \(side) journey")
    }
}

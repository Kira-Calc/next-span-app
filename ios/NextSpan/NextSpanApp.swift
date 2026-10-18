import SwiftUI

@main
struct NextSpanApp: App {
    @State private var state: AppState = {
        let s = AppState()
        s.applyLaunchEnvironment()
        return s
    }()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(state)
        }
    }
}

struct RootView: View {
    @Environment(AppState.self) private var state

    var body: some View {
        @Bindable var state = state
        NavigationStack(path: $state.path) {
            WelcomeView()
                .navigationDestination(for: Screen.self) { screen in
                    destination(screen)
                        .tint(screen.side.tint)
                        .toolbar { ToolbarItem(placement: .topBarTrailing) { ScreenMenu() } }
                        .prototypeNotice()
                }
        }
        .tint(.nsInk)
    }

    @ViewBuilder
    private func destination(_ screen: Screen) -> some View {
        switch screen {
        case .estimate: EstimateView()
        case .checklist: ChecklistView()
        case .grade: GradeView()
        case .listing: ListingView()
        case .search: SearchView()
        case .batch: BatchView()
        case .accept: AcceptView()
        case .certificates: CertificatesView()
        }
    }
}

/// Jump to any screen, for demos and user testing.
struct ScreenMenu: View {
    @Environment(AppState.self) private var state

    var body: some View {
        Menu {
            Button("Start", systemImage: "house") { state.path = [] }
            Section("Developer") {
                ForEach([Screen.estimate, .checklist, .grade, .listing]) { s in
                    Button("\(s.number)  \(s.title)") { state.jump(to: s) }
                }
            }
            Section("Specifier") {
                ForEach([Screen.search, .batch, .accept, .certificates]) { s in
                    Button("\(s.number)  \(s.title)") { state.jump(to: s) }
                }
            }
        } label: {
            Image(systemName: "square.grid.2x2")
        }
        .accessibilityLabel("Go to screen")
    }
}

/// Section header used across screens: number in a black square, as on the printed checklist.
struct NumberedHeader: View {
    let number: String
    let title: String

    var body: some View {
        HStack(spacing: 10) {
            Text(number)
                .font(.footnote.weight(.bold).monospacedDigit())
                .foregroundStyle(.white)
                .frame(width: 26, height: 26)
                .background(Color.nsInkFixed)
                .accessibilityHidden(true)
            Text(title)
                .font(.headline)
                .foregroundStyle(Color.nsInk)
                .textCase(nil)
        }
        .padding(.bottom, 4)
        .accessibilityAddTraits(.isHeader)
    }
}

/// Full-screen image viewer for the printed originals, with pinch to zoom.
struct ImageViewer: View {
    let image: String
    let title: String
    var band: Color = .nsInkFixed
    var footerTitle: String = "Done"
    @Environment(\.dismiss) private var dismiss
    @State private var scale: CGFloat = 1

    var body: some View {
        NavigationStack {
            ScrollView([.vertical, .horizontal]) {
                Image(image)
                    .resizable()
                    .scaledToFit()
                    .frame(width: (UIScreen.current?.bounds.width ?? 390) * scale - 32)
                    .overlay(Rectangle().stroke(Color.nsInk.opacity(0.2), lineWidth: 1))
                    .padding(16)
                    .gesture(MagnifyGesture().onChanged { scale = max(1, min(3, $0.magnification)) })
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Close", systemImage: "xmark") { dismiss() }
                }
            }
            .safeAreaInset(edge: .top, spacing: 0) { Rectangle().fill(band).frame(height: 6) }
            .safeAreaInset(edge: .bottom) {
                Button(footerTitle) { dismiss() }
                    .buttonStyle(.glassProminent)
                    .controlSize(.large)
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal)
                    .padding(.bottom, 8)
            }
        }
    }
}

extension UIScreen {
    static var current: UIScreen? {
        (UIApplication.shared.connectedScenes.first as? UIWindowScene)?.screen
    }
}
